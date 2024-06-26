import { Folder, Form, Prisma, Team, User } from '@prisma/client';
import { Response } from 'express';
import status from 'http-status';

import { getMailService, Mailer } from '@/infracstructure/mailer/mailer';
import { AuthService, getAuthService } from '@/services/auth.service';
import { FormType, GetFormsArgs } from '@/types/forms.types';

import {
  ALLOWED_SORT_FORM_DIRECTIONS,
  ALLOWED_SORT_FORM_FIELDS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  ERROR_MESSAGES,
  FORM_ERROR_MESSAGES,
  FORM_SUCCESS_MESSAGES,
  SORT_FORM_DIRECTIONS,
  SORT_FORM_FIELDS,
  TEAM_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
  USER_SUCCESS_MESSAGES,
} from '../constants';
import {
  AddFormMemberSchemaType,
  CreateFormSchemaType,
  GetFormsQueryParamsSchemaType,
  RemoveFormMemberSchemaType,
  UpdateFormSchemaType,
} from '../schemas/forms.schemas';
import { FormsService, getFormsService } from '../services/forms.service';
import { getTeamsService, TeamsService } from '../services/teams.service';
import { getUsersService, UsersService } from '../services/users.service';
import { CustomRequest } from '../types/customRequest.types';
import {
  canDelete,
  canEdit,
  createJWT,
  errorResponse,
  findFolderById,
  findTeamById,
  successResponse,
} from '../utils';
import { io } from '..';

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
  private authService: AuthService;

  public constructor() {
    this.formsService = getFormsService();
    this.usersService = getUsersService();
    this.teamsService = getTeamsService();
    this.authService = getAuthService();
  }

  private getFormsByQuery = async (
    args: GetFormsArgs & {
      formType: FormType | undefined;
      userId: string;
    },
  ) => {
    const {
      formType,
      offset,
      limit,
      searchText,
      isDeleted,
      isFavourite,
      sortField,
      sortDirection,
      folderId,
      teamId,
      userId,
    } = args;

    switch (formType) {
      case FormType.All:
        return this.formsService.getAllFormsByQuery(userId, {
          offset,
          limit,
          searchText,
          isDeleted,
          sortField,
          sortDirection,
          folderId,
          teamId,
          isFavourite,
        });
      case FormType.Shared:
        return this.formsService.getSharedFormsOfUser(userId, {
          offset,
          limit,
          searchText,
          isDeleted,
          sortField,
          sortDirection,
          isFavourite,
        });
      case FormType.Owned:
        return this.formsService.getFormsByUserId(userId, {
          offset,
          limit,
          searchText,
          isDeleted,
          sortField,
          sortDirection,
          folderId,
          teamId,
          isFavourite,
        });
      default:
        return [];
    }
  };

  private getTotalFormsByQuery = async (
    args: GetFormsArgs & {
      formType: FormType | undefined;
      userId: string;
    },
  ) => {
    const {
      formType,
      offset,
      limit,
      searchText,
      isDeleted,
      isFavourite,
      sortField,
      sortDirection,
      folderId,
      teamId,
      userId,
    } = args;

    switch (formType) {
      case FormType.All:
        return this.formsService.getTotalFormsByQuery(userId, {
          offset,
          limit,
          searchText,
          isDeleted,
          sortField,
          sortDirection,
          folderId,
          teamId,
          isFavourite,
        });
      case FormType.Shared:
        return this.formsService.getTotalSharedFormsOfUser(userId, {
          offset,
          limit,
          searchText,
          isDeleted,
          sortField,
          sortDirection,
          isFavourite,
        });
      case FormType.Owned:
        return this.formsService.getTotalFormsByUserId(userId, {
          offset,
          limit,
          searchText,
          isDeleted,
          sortField,
          sortDirection,
          folderId,
          teamId,
          isFavourite,
        });
      default:
        return 0;
    }
  };

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
        formType = FormType.Owned,
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

      if (folderId && formType !== FormType.Shared) {
        await findFolderById(folderId);
      }

      if (teamId && formType !== FormType.Shared) {
        await findTeamById(teamId);
      }

      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      const forms = await this.getFormsByQuery({
        userId,
        offset,
        limit,
        searchText,
        formType,
        isFavourite,
        isDeleted,
        sortField,
        sortDirection,
        folderId,
        teamId,
      });
      const totalForms = await this.getTotalFormsByQuery({
        userId,
        offset,
        limit,
        searchText,
        formType,
        isFavourite,
        isDeleted,
        sortField,
        sortDirection,
        folderId,
        teamId,
      });

      const totalPages = Math.ceil(totalForms / pageSize);

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
        totalForms: totalForms,
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
      if (form.disabledOnSpecificDate) {
        const scheduledTime = new Date(form.specificDate).getTime();
        //TODO: UPDATE FOLLOWING DATABASE DEPLOYED
        const now = new Date().getTime();
        if (scheduledTime - now < 0 || scheduledTime - now === 0) {
          await this.formsService.updateDisabledStatus(form.id, true);
        }
      }
      const updatedForm = await this.formsService.getFormById(form.id);
      return successResponse(res, updatedForm);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public getUsersInForm = async (
    req: CustomRequest<{ form: Form }>,
    res: Response,
  ) => {
    try {
      const { form } = req.body;

      const users = await this.usersService.getUsersByFormId(
        form!.permissions as string[],
      );
      if (!users)
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.USER_NOT_FOUND,
          status.NOT_FOUND,
        );

      return successResponse(res, users);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public addFormMember = async (
    req: CustomRequest<AddFormMemberSchemaType & { form: Form }>,
    res: Response,
  ) => {
    try {
      const { email, form } = req.body;

      const foundUser = await this.authService.getUserByEmail(email);
      if (!foundUser) {
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.USER_NOT_FOUND,
          status.NOT_FOUND,
        );
      }

      const users = await this.usersService.getUsersByFormId(
        form!.permissions as string[],
      );

      const memberExistsInForm = users.find((user) => user.email === email);

      if (memberExistsInForm) {
        return errorResponse(
          res,
          FORM_ERROR_MESSAGES.USER_EXISTS_IN_FORM,
          status.BAD_REQUEST,
        );
      }

      await this.formsService.addFormMember(form.id, foundUser.id);

      io.to(form.id).emit('formMemberUpdate');

      return successResponse(
        res,
        {},
        FORM_SUCCESS_MESSAGES.ADD_FORM_MEMBER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public inviteFormMember = async (
    req: CustomRequest<
      AddFormMemberSchemaType & { form: Form } & { user: User }
    >,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { user, email, form } = req.body;

      const users = await this.usersService.getUsersByFormId(
        form!.permissions as string[],
      );

      const memberExistsInForm = users.find((user) => user.email === email);

      if (memberExistsInForm) {
        return errorResponse(
          res,
          FORM_ERROR_MESSAGES.USER_EXISTS_IN_FORM,
          status.BAD_REQUEST,
        );
      }

      const payload = {
        userId: userId,
        email: email,
        form: form,
        senderName: user.username,
      };
      const acceptedToken = createJWT(payload);
      const invitedUrl = `${process.env.FRONT_END_URL}/sharing-form/${form.id}?view-invitation=true&token=${acceptedToken}`;

      try {
        const mailer: Mailer = getMailService();
        mailer.sendInviteToFormEmail(
          email,
          user.username,
          form.title,
          invitedUrl,
        );
        return successResponse(
          res,
          invitedUrl,
          USER_SUCCESS_MESSAGES.SENT_EMAIL_SUCCESS,
        );
      } catch (error) {
        return errorResponse(res, FORM_ERROR_MESSAGES.CAN_NOT_INVITE_USER, 500);
      }
    } catch (error) {
      return errorResponse(res);
    }
  };

  public removeFormMember = async (
    req: CustomRequest<RemoveFormMemberSchemaType & { form: Form }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { memberIds, form } = req.body;

      if (!canEdit(userId, form.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      for (const memberId of memberIds) {
        if (memberId === form.creatorId) {
          return errorResponse(
            res,
            FORM_ERROR_MESSAGES.CAN_NOT_REMOVE_FORM_OWNER,
            status.BAD_REQUEST,
          );
        }

        const existingUser = await this.usersService.getUserByID(memberId);
        if (!existingUser) {
          return errorResponse(
            res,
            `User with ID: ${memberId} does not exist`,
            status.BAD_REQUEST,
          );
        }
        const users = await this.usersService.getUsersByFormId(
          form!.permissions as string[],
        );

        const memberExistsInForm = users.find((user) => user.id === memberId);

        if (!memberExistsInForm) {
          return errorResponse(
            res,
            `User with ID: ${memberId} is not a member in the form`,
            status.BAD_REQUEST,
          );
        }
      }

      await this.formsService.removeFormMember(form.id, memberIds);

      return successResponse(
        res,
        {},
        FORM_SUCCESS_MESSAGES.REMOVE_FORM_MEMBER_SUCCESS,
      );
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

      io.to(form.id).emit('formUpdate');

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
  public updateDisableOnSpecificDate = async (
    req: CustomRequest<{ form: Form; user: User; specificDate: Date }>,
    res: Response,
  ) => {
    try {
      const { form, user, specificDate } = req.body;
      if (form.creatorId !== user.id)
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );

      const { disabledOnSpecificDate } = req.params;
      await this.formsService.updateSpecificDate(
        form.id,
        disabledOnSpecificDate.toLowerCase() === 'true',
        specificDate,
      );
      if (disabledOnSpecificDate.toLowerCase() === 'true') {
        if (form.disabled) {
          await this.formsService.updateDisabledStatus(form.id, false);
        }
      }
      const updatedForm = await this.formsService.getFormById(form.id);
      return successResponse(
        res,
        updatedForm,
        FORM_SUCCESS_MESSAGES.UPDATE_FORM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
  public updateDisabledNotificationStatus = async (
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
      const { disabledNotification } = req.params;
      const updatedForm =
        await this.formsService.updateDisabledNotificationStatus(
          form.id,
          disabledNotification.toLowerCase() === 'true',
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
