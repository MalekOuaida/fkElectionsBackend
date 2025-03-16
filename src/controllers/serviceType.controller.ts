/**********************************
 * serviceType.controller.ts
 **********************************/
import { RequestHandler } from 'express';
import * as stService from '../services/serviceType.service';

export const createServiceTypeController: RequestHandler = async (req, res, next) => {
  try {
    const { serviceTypeName } = req.body;
    const newId = await stService.createServiceType({ serviceTypeName });
    res.status(201).json({ serviceTypeId: newId });
  } catch (err) {
    next(err);
  }
};

export const getAllServiceTypesController: RequestHandler = async (req, res, next) => {
  try {
    const rows = await stService.getAllServiceTypes();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const updateServiceTypeController: RequestHandler = async (req, res, next) => {
  try {
    const stId = Number(req.params.id);
    const { newName } = req.body;
    const updated = await stService.updateServiceType(stId, newName);
    if (!updated) {
      res.status(404).json({ error: 'No update or not found' });
      return;
    }
    res.json({ message: 'Service type updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteServiceTypeController: RequestHandler = async (req, res, next) => {
  try {
    const stId = Number(req.params.id);
    await stService.deleteServiceType(stId);
    res.json({ message: 'Service type deleted' });
  } catch (err) {
    next(err);
  }
};
