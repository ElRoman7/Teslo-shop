import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  if (!file) return cb(new Error('File is Empty'), '');

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuidv4()}.${fileExtension}`;

  cb(null, fileName);
};
