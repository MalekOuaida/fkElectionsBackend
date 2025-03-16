/**********************************
 * mukhtar.routes.ts
 **********************************/
import { Router } from 'express';
import {
  createMukhtarController,
  getAllMukhtarsController
} from '../controllers/mukhtar.controller';

const mukhtarRouter = Router();

mukhtarRouter.post('/', createMukhtarController);
mukhtarRouter.get('/', getAllMukhtarsController);

export default mukhtarRouter;
