import { Response } from 'express';
import status from 'http-status';

import { FOLDER_ERROR_MESSAGES } from '../constants';
import { FoldersService, getFoldersService } from '../services/folders.service';

import { errorResponse } from './messages.utils';

const foldersService: FoldersService = getFoldersService();

export const findFolderById = async (folderId: number, res: Response) => {
  const existingFolder = await foldersService.getFolderById(folderId);
  if (!existingFolder) {
    return errorResponse(
      res,
      FOLDER_ERROR_MESSAGES.FOLDER_NOT_FOUND,
      status.NOT_FOUND,
    );
  }
  return existingFolder;
};
