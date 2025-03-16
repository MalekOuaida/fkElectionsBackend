// src/routes/fileUpload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadFileController } from '../controllers/fileUpload.controller';

// create Multer instance, store files in 'uploads/' temporarily
const upload = multer({ dest: 'uploads/' });

const fileUploadRouter = Router();

// e.g. POST /api/uploads/file? -> attach csv or xlsx in 'myFile'
fileUploadRouter.post('/file', upload.single('myFile'), uploadFileController);

export default fileUploadRouter;
