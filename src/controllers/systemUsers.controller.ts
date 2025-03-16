/*********************************
 * systemUsers.controller.ts
 *********************************/
import { RequestHandler } from 'express';
import * as userService from '../services/systemUsers.service';

export const createUserController: RequestHandler = async (req, res, next) => {
  try {
    const newId = await userService.createSystemUser(req.body);
    res.status(201).json({ userId: newId });
  } catch (err) {
    next(err);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const { userEmail, password } = req.body;
    const user = await userService.authenticateUser(userEmail, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    // Could generate JWT or something; for now just return user
    res.json({ message: 'Login success', user });
  } catch (err) {
    next(err);
  }
};

export const getUserByIdController: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUserController: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const updated = await userService.updateSystemUser(userId, req.body);
    if (!updated) {
      res.status(404).json({ error: 'No update or not found' });
      return;
    }
    res.json({ message: 'User updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteUserController: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    await userService.deleteSystemUser(userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
