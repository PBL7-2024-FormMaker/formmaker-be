import path from 'path';

import { Request } from 'express';
import multer, { diskStorage, FileFilterCallback } from 'multer';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const maxSize = 1048576 * 10; // 10 MB limit
const allowedExtensions = ['.png', '.jpg', '.jpeg'];

const storage = diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (
  req: MulterRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, and .jpeg files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter,
});

export default upload;
