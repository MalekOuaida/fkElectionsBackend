/************************************************
 * relativesAndServices.routes.ts
 ************************************************/
import { Router } from 'express';
import {
  createRelativeController,
  createCitizenServiceController,
  getServicesForCitizenController
} from '../controllers/relativesAndServices.controller';

const relativesServicesRouter = Router();

relativesServicesRouter.post('/relatives', createRelativeController);
relativesServicesRouter.post('/citizen-services', createCitizenServiceController);
relativesServicesRouter.get('/citizen-services/:citizenId', getServicesForCitizenController);

export default relativesServicesRouter;
