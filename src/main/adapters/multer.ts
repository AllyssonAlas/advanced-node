import { RequestHandler } from 'express';
import multer from 'multer';

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture');
  upload(req, res, () => {
    next();
  });
};
