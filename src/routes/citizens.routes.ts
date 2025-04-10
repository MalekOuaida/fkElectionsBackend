/***********************
 * citizens.routes.ts
 ***********************/
import { Router } from 'express';
import {
  createCitizenController,
  getCitizenByIdController,
  updateCitizenController,
  deleteCitizenController,
  searchCitizensController,
  getAllCitizensController // Import the new controller
} from '../controllers/citizens.controller';

const citizensRouter = Router();

// CREATE (POST /)
citizensRouter.post('/', createCitizenController);

// READ ALL (GET /) - must be before :id or else /:id will capture "all"
citizensRouter.get('/', getAllCitizensController);

// READ ONE (GET /:id)
citizensRouter.get('/:id', getCitizenByIdController);

// UPDATE (PATCH /:id)
citizensRouter.patch('/:id', updateCitizenController);

// DELETE (DELETE /:id)
citizensRouter.delete('/:id', deleteCitizenController);

// SEARCH (GET /search/filter)
citizensRouter.get('/search/filter', searchCitizensController);

export default citizensRouter;
