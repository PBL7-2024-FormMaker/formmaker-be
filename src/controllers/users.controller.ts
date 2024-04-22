import { User } from '@prisma/client';
import { Request, Response } from 'express';
import status from 'http-status';

import { CustomRequest } from '@/types/customRequest.types';

import { USER_ERROR_MESSAGES, USER_SUCCESS_MESSAGES } from '../constants';
import {
  ChangePasswordSchemaType,
  UpdateUserSchemaType,
} from '../schemas/users.schemas';
import { AuthService, getAuthService } from '../services/auth.service';
import { getUsersService, UsersService } from '../services/users.service';
import { comparePassword, errorResponse, successResponse } from '../utils';

let instance: UsersController | null = null;

export const getUsersController = () => {
  if (!instance) {
    instance = new UsersController();
  }
  return instance;
};

export class UsersController {
  private usersService: UsersService;
  private authService: AuthService;

  public constructor() {
    this.usersService = getUsersService();
    this.authService = getAuthService();
  }

  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.usersService.getAllUsers();
      const returnUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        organizationLogo: user.organizationLogo,
        organizationName: user.organizationName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return successResponse(
        res,
        returnUsers,
        USER_SUCCESS_MESSAGES.GET_LIST_USER,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public getUserProfile = async (
    req: CustomRequest<{ user: User }>,
    res: Response,
  ) => {
    try {
      const { user } = req.body;

      const returnUser = {
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        organizationLogo: user.organizationLogo,
        organizationName: user.organizationName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return successResponse(res, returnUser, USER_SUCCESS_MESSAGES.GET_USER);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public delUserByID = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const foundUser = await this.usersService.getUserByID(Number(userId));

      if (!foundUser)
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.USER_NOT_FOUND,
          status.NOT_FOUND,
        );

      await this.usersService.delUserByID(Number(userId));

      return successResponse(
        res,
        {},
        USER_SUCCESS_MESSAGES.DELETE_USER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public changePassword = async (
    req: CustomRequest<ChangePasswordSchemaType & { user: User }>,
    res: Response,
  ) => {
    try {
      const { currentPassword, newPassword, user } = req.body;

      if (!comparePassword(currentPassword, user.password ?? ''))
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.INCORRECT_PASSWORD,
          status.BAD_REQUEST,
        );

      if (currentPassword === newPassword)
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.INVALID_NEW_PASSWORD,
          status.BAD_REQUEST,
        );

      await this.usersService.changePassword(Number(user.id), newPassword);

      return successResponse(res, {}, USER_SUCCESS_MESSAGES.CHANGE_PW_SUCCESS);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public updateUserProfile = async (
    req: CustomRequest<UpdateUserSchemaType>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;
      const { username, email, avatarUrl, organizationName, organizationLogo } =
        req.body;

      if (email) {
        const isRegisteredEmail = await this.authService.checkExist(email);
        if (isRegisteredEmail)
          return errorResponse(
            res,
            USER_ERROR_MESSAGES.USER_ALREADY_EXISTS,
            status.BAD_REQUEST,
          );
      }

      await this.usersService.updateUserByID(Number(userId), {
        username,
        email,
        avatarUrl,
        organizationName,
        organizationLogo,
      });

      return successResponse(
        res,
        {},
        USER_SUCCESS_MESSAGES.UPDATE_USER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
}
