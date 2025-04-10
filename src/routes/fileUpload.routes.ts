// src/routes/fileUpload.routes.ts

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadFileController } from '../controllers/fileUpload.controller';

console.log('✅ fileUploadRouter file is being imported!');

// 1) We store uploads in "uploads/" folder (create this folder at project root).
const upload = multer({ dest: 'uploads/' });

// 2) Create a router
const fileUploadRouter = Router();

// 3) Route: POST /api/uploads/file
fileUploadRouter.post(
  '/file',
  (req: Request, res: Response, next: NextFunction) => {
    console.log('✅ [fileUpload.routes] POST /file route was called.');
    next();
  },
  upload.single('myFile'),  // "myFile" must match form-data key in Postman
  uploadFileController
);

export default fileUploadRouter;
