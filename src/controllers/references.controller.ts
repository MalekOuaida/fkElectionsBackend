/******************************
 * references.controller.ts
 ******************************/
import { RequestHandler } from 'express';
import * as referencesService from '../services/references.service';

export const getAllBloodTypesController: RequestHandler = async (req, res, next) => {
  try {
    const bloodTypes = await referencesService.getAllBloodTypes();
    res.json(bloodTypes);
  } catch (err) {
    next(err);
  }
};

export const createBloodTypeController: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newId = await referencesService.createBloodType(name);
    res.status(201).json({ bloodTypeId: newId });
  } catch (err) {
    next(err);
  }
};