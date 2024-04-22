import { NextFunction, Request, Response } from 'express';

import { errorResponse, findResponseById } from '../utils';

export const checkResponseExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { responseId } = req.params;
    const existingResponse = await findResponseById(Number(responseId), res);
    req.body.response = existingResponse;
    next();
  } catch (error) {
    return errorResponse(res);
  }
};
