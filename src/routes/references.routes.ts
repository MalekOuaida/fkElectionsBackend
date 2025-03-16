/******************************
 * references.routes.ts
 ******************************/
import { Router } from 'express';
import {
  getAllBloodTypesController,
  createBloodTypeController
} from '../controllers/references.controller';

const referencesRouter = Router();

referencesRouter.get('/blood-types', getAllBloodTypesController);
referencesRouter.post('/blood-types', createBloodTypeController);

// similarly for marital status, education level, etc.

export default referencesRouter;
