/**********************************
 * serviceStatus.controller.ts
 **********************************/
import { RequestHandler } from 'express';
import * as ssService from '../services/serviceStatus.service';

export const createServiceStatusController: RequestHandler = async (req, res, next) => {
  try {
    const { statusName } = req.body;
    const newId = await ssService.createServiceStatus({ statusName });
    res.status(201).json({ serviceStatusId: newId });
  } catch (err) {
    next(err);
  }
};

export const getAllServiceStatusesController: RequestHandler = async (req, res, next) => {
  try {
    const rows = await ssService.getAllServiceStatuses();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const updateServiceStatusController: RequestHandler = async (req, res, next) => {
  try {
    const stId = Number(req.params.id);
    const { newName } = req.body;
    const updated = await ssService.updateServiceStatus(stId, newName);
    if (!updated) {
      res.status(404).json({ error: 'No update or not found' });
      return;
    }
    res.json({ message: 'Service status updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteServiceStatusController: RequestHandler = async (req, res, next) => {
  try {
    const stId = Number(req.params.id);
    await ssService.deleteServiceStatus(stId);
    res.json({ message: 'Service status deleted' });
  } catch (err) {
    next(err);
  }
};