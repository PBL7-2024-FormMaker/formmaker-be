import { Response } from 'express';
import status from 'http-status';

import { USER_ERROR_MESSAGES } from '../constants';
import { getUsersService, UsersService } from '../services/users.service';

import { errorResponse } from './messages.utils';

const usersService: UsersService = getUsersService();

export const findUserById = async (userId: number, res: Response) => {
  const existingUser = await usersService.getUserByID(userId);
  if (!existingUser) {
    return errorResponse(
      res,
      USER_ERROR_MESSAGES.USER_NOT_FOUND,
      status.NOT_FOUND,
    );
  }
  return existingUser;
};
