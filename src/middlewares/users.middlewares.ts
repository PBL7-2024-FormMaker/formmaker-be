import { NextFunction, Request, Response } from 'express';

import { errorResponse, findUserById } from '../utils';

export const checkUserExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.session;
    const existingUser = await findUserById(userId, res);
    req.body.user = existingUser;
    next();
  } catch (error) {
    return errorResponse(res);
  }
};
