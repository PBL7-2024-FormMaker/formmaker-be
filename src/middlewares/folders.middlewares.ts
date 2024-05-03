import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

import { FOLDER_ERROR_MESSAGES } from '../constants';
import { errorResponse, findFolderById } from '../utils';

export const checkFolderExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { folderId } = req.params;
    const existingFolder = await findFolderById(folderId);
    if (!existingFolder) {
      return errorResponse(
        res,
        FOLDER_ERROR_MESSAGES.FOLDER_NOT_FOUND,
        status.BAD_REQUEST,
      );
    }
    req.body.folder = existingFolder;
    next();
  } catch (error) {
    return errorResponse(res);
  }
};
