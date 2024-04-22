import { Folder, Form, Prisma, Team, User } from '@prisma/client';
import { Response } from 'express';
import status from 'http-status';

import {
  ALLOWED_SORT_FORM_DIRECTIONS,
  ALLOWED_SORT_FORM_FIELDS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  ERROR_MESSAGES,
  FORM_SUCCESS_MESSAGES,
  SORT_FORM_DIRECTIONS,
  SORT_FORM_FIELDS,
  TEAM_ERROR_MESSAGES,
} from '../constants';
import {
  CreateFormSchemaType,
  GetFormsQueryParamsSchemaType,
  UpdateFormSchemaType,
} from '../schemas/forms.schemas';
import { FoldersService, getFoldersService } from '../services/folders.service';
import { FormsService, getFormsService } from '../services/forms.service';
import { getTeamsService, TeamsService } from '../services/teams.service';
import { getUsersService, UsersService } from '../services/users.service';
import { CustomRequest } from '../types/customRequest.types';
import {
  canDelete,
  canEdit,
  errorResponse,
  findFolderById,
  findTeamById,
  successResponse,
} from '../utils';

let instance: FormsController | null = null;

export const getFormsController = () => {
  if (!instance) {
    instance = new FormsController();
  }

  return instance;
};

export class FormsController {
  private formsService: FormsService;
  private usersService: UsersService;
  private teamsService: TeamsService;
  private foldersService: FoldersService;

  public constructor() {
    this.formsService = getFormsService();
    this.usersService = getUsersService();
    this.teamsService = getTeamsService();
    this.foldersService = getFoldersService();
  }

  public getAllForms = async (
    req: CustomRequest<unknown, GetFormsQueryParamsSchemaType>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const {
        page = DEFAULT_PAGE,
        pageSize = DEFAULT_PAGE_SIZE,
        search: searchText = '',
        isDeleted: isDeletedParam,
        isFavourite: isFavouriteParam,
        sortField = SORT_FORM_FIELDS.CREATED_AT,
        sortDirection = SORT_FORM_DIRECTIONS.DESC,
        folderId,
        teamId,
      } = req.query;

      const isDeleted = isDeletedParam === 1;
      const isFavourite = isFavouriteParam === 1;

      if (!ALLOWED_SORT_FORM_FIELDS.includes(sortField)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.INVALID_SORT_FIELD,
          status.BAD_REQUEST,
        );
      }

      if (!ALLOWED_SORT_FORM_DIRECTIONS.includes(sortDirection)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.INVALID_SORT_DIRECTION,
          status.BAD_REQUEST,
        );
      }

      if (folderId) {
        await findFolderById(Number(folderId), res);
      }

      if (teamId) {
        await findTeamById(Number(teamId), res);
      }

      const totalForms = await this.formsService.getTotalFormsByUserId(userId, {
        searchText,
        isDeleted,
        isFavourite,
        folderId,
        teamId,
      });
      const totalPages = Math.ceil(totalForms / pageSize);

      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      const forms = await this.formsService.getFormsByUserId(userId, {
        offset,
        limit,
        searchText,
        isDeleted,
        isFavourite,
        sortField,
        sortDirection,
        folderId,
        teamId,
      });

      const formsResponseData = forms.map((form) => {
        const isFavourite =
          form.favouritedByUsers.findIndex((user) => user.id === userId) !== -1;
        return {
          ...form,
          isFavourite,
        };
      });

      const responseData = {
        forms: formsResponseData,
        page,
        pageSize,
        totalForms,
        totalPages,
      };
      return successResponse(res, responseData);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public getFormDetails = async (
    req: CustomRequest<{ form: Form }>,
    res: Response,
  ) => {
    try {
      const { form } = req.body;

      return successResponse(res, form);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public createForm = async (
    req: CustomRequest<CreateFormSchemaType>,
    res: Response,
  ) => {
    try {
      const { title, logoUrl, settings, elements } = req.body;
      const { userId } = req.session;

      const newForm = await this.formsService.createForm(userId, {
        title,
        logoUrl,
        settings,
        elements,
      });
      return successResponse(
        res,
        newForm,
        FORM_SUCCESS_MESSAGES.CREATE_FORM_SUCCESS,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public createFormInTeam = async (
    req: CustomRequest<CreateFormSchemaType & { team: Team }>,
    res: Response,
  ) => {
    try {
      const { title, logoUrl, settings, elements, team } = req.body;
      const { userId } = req.session;

      const newForm = await this.formsService.createFormInTeam(userId, {
        title,
        logoUrl,
        settings,
        elements,
        teamId: team.id,
      });
      return successResponse(
        res,
        newForm,
        FORM_SUCCESS_MESSAGES.CREATE_FORM_SUCCESS,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public createFormInMyFolder = async (
    req: CustomRequest<CreateFormSchemaType & { folder: Folder }>,
    res: Response,
  ) => {
    try {
      const { title, logoUrl, settings, elements, folder } = req.body;
      const { userId } = req.session;

      if (!canEdit(userId, folder.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      const newForm = await this.formsService.createFormInMyFolder(userId, {
        title,
        logoUrl,
        settings,
        elements,
        folderId: folder.id,
      });
      return successResponse(
        res,
        newForm,
        FORM_SUCCESS_MESSAGES.CREATE_FORM_SUCCESS,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public createFormInFolderOfTeam = async (
    req: CustomRequest<CreateFormSchemaType & { folder: Folder; team: Team }>,
    res: Response,
  ) => {
    try {
      const { title, logoUrl, settings, elements, folder, team } = req.body;
      const { userId } = req.session;

      const folderExistsInTeam =
        await this.teamsService.checkFolderExistsInTeam(team.id, folder.id);
      if (!folderExistsInTeam) {
        return errorResponse(
          res,
          TEAM_ERROR_MESSAGES.FOLDER_NOT_IN_TEAM,
          status.BAD_REQUEST,
        );
      }

      if (!canEdit(userId, folder.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      const newForm = await this.formsService.createFormInFolderOfTeam(userId, {
        title,
        logoUrl,
        settings,
        elements,
        folderId: folder.id,
        teamId: team.id,
      });
      return successResponse(
        res,
        newForm,
        FORM_SUCCESS_MESSAGES.CREATE_FORM_SUCCESS,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public updateForm = async (
    req: CustomRequest<UpdateFormSchemaType & { form: Form }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { title, logoUrl, settings, elements, form } = req.body;

      if (!canEdit(userId, form.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      const updatedForm = await this.formsService.updateForm(form.id, {
        title,
        logoUrl,
        settings,
        elements,
      });
      return successResponse(
        res,
        updatedForm,
        FORM_SUCCESS_MESSAGES.UPDATE_FORM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
  public updateDisabledStatus = async (
    req: CustomRequest<{ form: Form; user: User }>,
    res: Response,
  ) => {
    try {
      const { form, user } = req.body;

      if (form.creatorId !== user.id)
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );

      const { disabled } = req.params;

      const updatedForm = await this.formsService.updateDisabledStatus(
        form.id,
        disabled.toLowerCase() === 'true',
      );
      return successResponse(
        res,
        updatedForm,
        FORM_SUCCESS_MESSAGES.UPDATE_FORM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public deleteForm = async (
    req: CustomRequest<{ form: Form }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { form } = req.body;

      if (!canDelete(userId, form.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      if (form.deletedAt === null) {
        const deletedForm = await this.formsService.softDeleteForm(form.id);
        return successResponse(
          res,
          deletedForm,
          FORM_SUCCESS_MESSAGES.SOFT_DELETE_SUCCESS,
        );
      } else {
        await this.formsService.hardDeleteForm(form.id);
        return successResponse(
          res,
          {},
          FORM_SUCCESS_MESSAGES.HARD_DELETE_SUCCESS,
        );
      }
    } catch (error) {
      return errorResponse(res);
    }
  };

  public restoreForm = async (
    req: CustomRequest<{ form: Form }>,
    res: Response,
  ) => {
    try {
      const { form } = req.body;

      const restoredForm = await this.formsService.restoreForm(form.id);

      return successResponse(
        res,
        restoredForm,
        FORM_SUCCESS_MESSAGES.RESTORE_FORM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public addToFavourites = async (
    req: CustomRequest<{ form: Form }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { form } = req.body;

      const favouriteFormsOfUser =
        await this.usersService.getFavouriteFormsOfUser(userId);

      if (favouriteFormsOfUser?.findIndex(({ id }) => id === form.id) !== -1) {
        const responseData = await this.formsService.removeFromFavourites(
          form.id,
          userId,
        );
        return successResponse(
          res,
          responseData,
          FORM_SUCCESS_MESSAGES.REMOVE_FROM_FAVOURITES_SUCCESS,
        );
      } else {
        const responseData = await this.formsService.addToFavourites(
          form.id,
          userId,
        );
        return successResponse(
          res,
          responseData,
          FORM_SUCCESS_MESSAGES.ADD_TO_FAVOURITES_SUCCESS,
        );
      }
    } catch (error) {
      return errorResponse(res);
    }
  };

  public addToFolder = async (
    req: CustomRequest<{ form: Form; folder: Folder }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { form, folder } = req.body;

      if (
        !canEdit(userId, form.permissions as Prisma.JsonObject) ||
        !canEdit(userId, folder.permissions as Prisma.JsonObject)
      ) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      await this.formsService.addToFolder(form.id, folder.id);
      return successResponse(
        res,
        {},
        FORM_SUCCESS_MESSAGES.ADD_TO_FOLDER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public removeFromFolder = async (
    req: CustomRequest<{ form: Form; folder: Folder }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { form, folder } = req.body;

      if (
        !canEdit(userId, form.permissions as Prisma.JsonObject) ||
        !canEdit(userId, folder.permissions as Prisma.JsonObject)
      ) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      await this.formsService.removeFromFolder(form.id);
      return successResponse(
        res,
        {},
        FORM_SUCCESS_MESSAGES.REMOVE_FROM_FOLDER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public moveToTeam = async (
    req: CustomRequest<{ form: Form; team: Team }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { form, team } = req.body;

      if (!canEdit(userId, form.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      await this.formsService.moveToTeam(form.id, team.id);

      return successResponse(
        res,
        {},
        FORM_SUCCESS_MESSAGES.MOVE_TO_TEAM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public moveBackToMyForms = async (
    req: CustomRequest<{ form: Form; team: Team }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { form, team } = req.body;

      if (form.creatorId !== userId) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      await this.formsService.moveBackToMyForms(userId, form.id, team.id);

      return successResponse(
        res,
        {},
        FORM_SUCCESS_MESSAGES.REMOVE_FROM_TEAM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
}
