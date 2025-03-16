/************************************************
 * relativesAndServices.controller.ts
 ************************************************/
import { RequestHandler } from 'express';
import * as rsService from '../services/relativesAndServices.service';

export const createRelativeController: RequestHandler = async (req, res, next) => {
  try {
    const relId = await rsService.createRelative(req.body);
    res.status(201).json({ relativesDetailsId: relId });
  } catch (err) {
    next(err);
  }
};

export const createCitizenServiceController: RequestHandler = async (req, res, next) => {
  try {
    const csId = await rsService.createCitizenService(req.body);
    res.status(201).json({ citizensServicesId: csId });
  } catch (err) {
    next(err);
  }
};

export const getServicesForCitizenController: RequestHandler = async (req, res, next) => {
  try {
    const cId = Number(req.params.citizenId);
    const rows = await rsService.getServicesForCitizen(cId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};