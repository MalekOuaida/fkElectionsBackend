// src/controllers/auth.controller.ts
import { RequestHandler } from 'express';
import * as authService from '../services/auth.service';

// POST /api/auth/register
export const registerController: RequestHandler = async (req, res, next) => {
  try {
    const { userName, userEmail, password, phoneNumber, role, citizenId } = req.body;
    const newUser = await authService.registerUser({
      userName, userEmail, password, phoneNumber, role, citizenId
    });
    // generate a token if you want them to be logged in immediately:
    const token = authService.generateToken(newUser);
    res.status(201).json({
      message: 'User registered',
      user: {
        userId: newUser.user_id,
        email: newUser.user_email,
        role: newUser.role
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const { userEmail, password } = req.body;
    const user = await authService.authenticateUser(userEmail, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = authService.generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      userId: user.user_id
    });
  } catch (err) {
    next(err);
  }
};
