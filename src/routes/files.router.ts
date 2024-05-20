import { Router } from 'express';

import { ROUTES } from '../constants';
import { fileController } from '../controllers/files.controller';
import { verifyToken } from '../middlewares';
import { uploadFile } from '../middlewares/multer.middlewares';

const filesRoute = Router();

filesRoute.post(
  ROUTES.FILE.UPLOAD,
  verifyToken,
  uploadFile.single('file'),
  fileController.uploadFile,
);

export default filesRoute;
