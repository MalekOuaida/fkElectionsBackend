/**********************************
 * serviceStatus.routes.ts
 **********************************/
import { Router } from 'express';
import {
  createServiceStatusController,
  getAllServiceStatusesController,
  updateServiceStatusController,
  deleteServiceStatusController
} from '../controllers/serviceStatus.controller';

const serviceStatusRouter = Router();

serviceStatusRouter.post('/', createServiceStatusController);
serviceStatusRouter.get('/', getAllServiceStatusesController);
serviceStatusRouter.patch('/:id', updateServiceStatusController);
serviceStatusRouter.delete('/:id', deleteServiceStatusController);

export default serviceStatusRouter;
