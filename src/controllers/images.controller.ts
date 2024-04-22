import { Request, Response } from 'express';
import status from 'http-status';

import cloudinary from '../configs/cloudinary.config';
import { IMAGE_ERROR_MESSAGES, IMAGE_SUCCESS_MESSAGES } from '../constants';
import { errorResponse, successResponse } from '../utils';

class ImageController {
  public uploadImage = async (req: Request, res: Response) => {
    try {
      if (req.file) {
        const { path: filePath } = req.file;
        const uploadResult = await cloudinary.uploader.upload(filePath);

        return successResponse(
          res,
          { url: uploadResult.url },
          IMAGE_SUCCESS_MESSAGES.UPLOAD_FILE_SUCCESS,
        );
      } else {
        return errorResponse(
          res,
          IMAGE_ERROR_MESSAGES.NO_FILE_UPLOADED,
          status.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return errorResponse(res);
    }
  };
}

let instance: ImageController | null = null;

const getInstance = () => {
  if (!instance) {
    instance = new ImageController();
  }
  return instance;
};

const imageController = getInstance();

export { imageController };
