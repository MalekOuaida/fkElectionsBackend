/*************************
 * location.routes.ts
 *************************/
import { Router } from 'express';
import {
  createGovernorateController,
  createDistrictController,
  createMunicipalityController,
  getMunicipalityDetailsController
} from '../controllers/location.controller';

const locationRouter = Router();

locationRouter.post('/governorate', createGovernorateController);
locationRouter.post('/district', createDistrictController);
locationRouter.post('/municipality', createMunicipalityController);
locationRouter.get('/municipality/:id', getMunicipalityDetailsController);

export default locationRouter;