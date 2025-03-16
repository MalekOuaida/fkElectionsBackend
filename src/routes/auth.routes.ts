// src/routes/auth.routes.ts
import { Router } from 'express';
import {
  registerController,
  loginController
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);

export default authRouter;
