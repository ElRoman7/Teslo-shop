import { Request } from 'express';
import { VALID_IMAGES_EXTENSIONS } from '../constants/valid-image-extensions.constants';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return cb(new Error('File is Empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  if (VALID_IMAGES_EXTENSIONS.includes(fileExtension)) return cb(null, true);

  cb(null, false);
};
