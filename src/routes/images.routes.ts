import { Router } from 'express';

import { ROUTES } from '../constants';
import { imageController } from '../controllers/images.controller';
import { verifyToken } from '../middlewares';
import upload from '../middlewares/multer.middlewares';

const imagesRoute = Router();

imagesRoute.post(
  ROUTES.IMAGE.UPLOAD,
  verifyToken,
  upload.single('image'),
  imageController.uploadImage,
);

export default imagesRoute;
