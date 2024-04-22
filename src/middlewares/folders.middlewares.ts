import { NextFunction, Request, Response } from 'express';

import { errorResponse, findFolderById } from '../utils';

export const checkFolderExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { folderId } = req.params;
    const existingFolder = await findFolderById(Number(folderId), res);
    req.body.folder = existingFolder;
    next();
  } catch (error) {
    return errorResponse(res);
  }
};
