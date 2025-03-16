/***********************
 * citizens.routes.ts
 ***********************/
import { Router } from 'express';
import {
  createCitizenController,
  getCitizenByIdController,
  updateCitizenController,
  deleteCitizenController,
  searchCitizensController
} from '../controllers/citizens.controller';

const citizensRouter = Router();

citizensRouter.post('/', createCitizenController);
citizensRouter.get('/:id', getCitizenByIdController);
citizensRouter.patch('/:id', updateCitizenController);
citizensRouter.delete('/:id', deleteCitizenController);
citizensRouter.get('/search/filter', searchCitizensController);

export default citizensRouter;
