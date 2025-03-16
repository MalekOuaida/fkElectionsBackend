/****************************
 * citizenAttrib.controller.ts
 ****************************/
import { RequestHandler } from 'express';
import * as citizenAttribService from '../services/citizenAttrib.service';

export const createCitizenAttribController: RequestHandler = async (req, res, next) => {
  try {
    const newId = await citizenAttribService.createCitizenAttrib(req.body);
    res.status(201).json({ id: newId, message: 'Citizen Attrib created' });
  } catch (err) {
    next(err);
  }
};

export const getCitizenAttribByCitizenController: RequestHandler = async (req, res, next) => {
  try {
    const cId = Number(req.params.citizenId);
    const result = await citizenAttribService.getCitizenAttribByCitizenId(cId);
    if (!result) {
      res.status(404).json({ error: 'No attributes found' });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateCitizenAttribController: RequestHandler = async (req, res, next) => {
  try {
    const attribId = Number(req.params.attribId);
    const updated = await citizenAttribService.updateCitizenAttrib(attribId, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Not found or no update done' });
      return;
    }
    res.json({ message: 'Citizen attrib updated', data: updated });
  } catch (err) {
    next(err);
  }
};

