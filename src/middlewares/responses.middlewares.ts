import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

import { RESPONSES_ERROR_MESSAGES } from '@/constants';

import { errorResponse, findResponseById } from '../utils';

export const checkResponseExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { responseId } = req.params;
    const existingResponse = await findResponseById(responseId);
    if (!existingResponse) {
      return errorResponse(
        res,
        RESPONSES_ERROR_MESSAGES.RESPONSE_NOT_FOUND,
        status.BAD_REQUEST,
      );
    }
    req.body.response = existingResponse;
    next();
  } catch (error) {
    return errorResponse(res);
  }
};
