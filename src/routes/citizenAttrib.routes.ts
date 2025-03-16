/****************************
 * citizenAttrib.routes.ts
 ****************************/
import { Router } from 'express';
import {
  createCitizenAttribController,
  getCitizenAttribByCitizenController,
  updateCitizenAttribController
} from '../controllers/citizenAttrib.controller';

const citizenAttribRouter = Router();

citizenAttribRouter.post('/', createCitizenAttribController);
citizenAttribRouter.get('/by-citizen/:citizenId', getCitizenAttribByCitizenController);
citizenAttribRouter.patch('/:attribId', updateCitizenAttribController);

export default citizenAttribRouter;