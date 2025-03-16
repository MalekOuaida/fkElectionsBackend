/*********************************
 * systemUsers.routes.ts
 *********************************/
import { Router } from 'express';
import {
  createUserController,
  loginController,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from '../controllers/systemUsers.controller';

const systemUsersRouter = Router();

systemUsersRouter.post('/', createUserController);
systemUsersRouter.post('/login', loginController);
systemUsersRouter.get('/:id', getUserByIdController);
systemUsersRouter.patch('/:id', updateUserController);
systemUsersRouter.delete('/:id', deleteUserController);

export default systemUsersRouter;
