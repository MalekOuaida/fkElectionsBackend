/**********************************
 * mukhtar.controller.ts
 **********************************/
import { RequestHandler } from 'express';
import * as mukhtarService from '../services/mukhtar.service';

export const createMukhtarController: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newId = await mukhtarService.createMukhtar(name);
    res.status(201).json({ mukhId: newId });
  } catch (err) {
    next(err);
  }
};

export const getAllMukhtarsController: RequestHandler = async (req, res, next) => {
  try {
    const rows = await mukhtarService.getAllMukhtars();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};