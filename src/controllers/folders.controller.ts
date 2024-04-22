import { Folder, Prisma, Team } from '@prisma/client';
import { Request, Response } from 'express';
import status from 'http-status';

import { ERROR_MESSAGES, FOLDER_SUCCESS_MESSAGES } from '../constants';
import {
  CreateFolderSchemaType,
  UpdateFolderSchemaType,
} from '../schemas/folders.schemas';
import { FoldersService, getFoldersService } from '../services/folders.service';
import { getTeamsService, TeamsService } from '../services/teams.service';
import { CustomRequest } from '../types/customRequest.types';
import {
  canDelete,
  canEdit,
  canView,
  errorResponse,
  successResponse,
} from '../utils';

let instance: FoldersController | null = null;

export const getFoldersController = () => {
  if (!instance) {
    instance = new FoldersController();
  }
  return instance;
};

export class FoldersController {
  private foldersService: FoldersService;
  private teamsService: TeamsService;

  public constructor() {
    this.foldersService = getFoldersService();
    this.teamsService = getTeamsService();
  }

  public createFolder = async (
    req: CustomRequest<CreateFolderSchemaType>,
    res: Response,
  ) => {
    try {
      const { name } = req.body;
      const { userId } = req.session;

      const newFolder = await this.foldersService.createFolder(userId, name);
      return successResponse(
        res,
        newFolder,
        FOLDER_SUCCESS_MESSAGES.CREATE_FOLDER_SUCCESS,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public createFolderInTeam = async (
    req: CustomRequest<CreateFolderSchemaType & { team: Team }>,
    res: Response,
  ) => {
    try {
      const { name, team } = req.body;
      const { userId } = req.session;

      const newFolder = await this.foldersService.createFolderInTeam(userId, {
        name,
        teamId: team.id,
      });
      return successResponse(
        res,
        newFolder,
        FOLDER_SUCCESS_MESSAGES.CREATE_FOLDER_SUCCESS,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public getAllFoldersOfUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.session;

      const folders = await this.foldersService.getAllFoldersOfUser(userId);

      return successResponse(res, folders);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public getIndependentFolders = async (req: Request, res: Response) => {
    try {
      const { userId } = req.session;

      const folders = await this.foldersService.getAllFoldersOfUser(
        userId,
        null,
      );

      return successResponse(res, folders);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public getFolderDetails = async (
    req: CustomRequest<{ folder: Folder }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { folder } = req.body;

      if (!canView(userId, folder.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      return successResponse(res, folder);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public updateFolder = async (
    req: CustomRequest<UpdateFolderSchemaType & { folder: Folder }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { folder } = req.body;

      if (!canEdit(userId, folder.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      const { name } = req.body;

      const updatedFolder = await this.foldersService.updateFolder(
        folder.id,
        name,
      );
      return successResponse(
        res,
        updatedFolder,
        FOLDER_SUCCESS_MESSAGES.UPDATE_FOLDER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public deleteFolder = async (
    req: CustomRequest<{ folder: Folder }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { folder } = req.body;

      if (!canDelete(userId, folder.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      await this.foldersService.deleteFolder(folder.id);
      return successResponse(
        res,
        {},
        FOLDER_SUCCESS_MESSAGES.DELETE_FOLDER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
}
