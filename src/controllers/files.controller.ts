import { Request, Response } from 'express';
import status from 'http-status';

import cloudinary from '../configs/cloudinary.config';
import { FILE_ERROR_MESSAGES, FILE_SUCCESS_MESSAGES } from '../constants';
import { errorResponse, successResponse } from '../utils';

class FileController {
  public uploadFile = async (req: Request, res: Response) => {
    try {
      if (req.file) {
        const { path: filePath } = req.file;
        const uploadResult = await cloudinary.uploader.upload(filePath);
        return successResponse(
          res,
          { url: uploadResult.url },
          FILE_SUCCESS_MESSAGES.UPLOAD_FILE_SUCCESS,
        );
      } else {
        return errorResponse(
          res,
          FILE_ERROR_MESSAGES.NO_FILE_UPLOADED,
          status.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return errorResponse(res);
    }
  };
}

let instance: FileController | null = null;

const getInstance = () => {
  if (!instance) {
    instance = new FileController();
  }
  return instance;
};

const fileController = getInstance();

export { fileController };
