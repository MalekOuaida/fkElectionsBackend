/**********************************
 * address.routes.ts
 **********************************/
import { Router } from 'express';
import { createAddressController } from '../controllers/address.controller';

const addressRouter = Router();

addressRouter.post('/', createAddressController);

export default addressRouter;