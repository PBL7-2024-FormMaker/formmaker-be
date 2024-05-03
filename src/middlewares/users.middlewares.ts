import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

import { USER_ERROR_MESSAGES } from '../constants';
import { errorResponse, findUserById } from '../utils';

export const checkUserExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.session;
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return errorResponse(
        res,
        USER_ERROR_MESSAGES.USER_NOT_FOUND,
        status.BAD_REQUEST,
      );
    }
    req.body.user = existingUser;
    next();
  } catch (error) {
    return errorResponse(res);
  }
};
