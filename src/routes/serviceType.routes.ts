/**********************************
 * serviceType.routes.ts
 **********************************/
import { Router } from 'express';
import {
  createServiceTypeController,
  getAllServiceTypesController,
  updateServiceTypeController,
  deleteServiceTypeController
} from '../controllers/serviceType.controller';

const serviceTypeRouter = Router();

serviceTypeRouter.post('/', createServiceTypeController);
serviceTypeRouter.get('/', getAllServiceTypesController);
serviceTypeRouter.patch('/:id', updateServiceTypeController);
serviceTypeRouter.delete('/:id', deleteServiceTypeController);

export default serviceTypeRouter;