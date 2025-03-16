/***********************
 * citizens.controller.ts
 ***********************/
import { RequestHandler } from 'express';
import * as citizensService from '../services/citizens.service';

export const createCitizenController: RequestHandler = async (req, res, next) => {
  try {
    const newId = await citizensService.createCitizen(req.body);
    res.status(201).json({ id: newId, message: 'Citizen created' });
  } catch (err) {
    next(err);
  }
};

export const getCitizenByIdController: RequestHandler = async (req, res, next) => {
  try {
    const citizenId = Number(req.params.id);
    const foundCitizen = await citizensService.getCitizenById(citizenId);
    if (!foundCitizen) {
      res.status(404).json({ error: 'Citizen not found' });
      return;
    }
    res.json(foundCitizen);
  } catch (err) {
    next(err);
  }
};

export const updateCitizenController: RequestHandler = async (req, res, next) => {
  try {
    const citizenId = Number(req.params.id);
    const updatedCitizen = await citizensService.updateCitizen(citizenId, req.body);
    if (!updatedCitizen) {
      res.status(404).json({ error: 'No update or not found' });
      return;
    }
    res.json({ message: 'Citizen updated', data: updatedCitizen });
  } catch (err) {
    next(err);
  }
};

export const deleteCitizenController: RequestHandler = async (req, res, next) => {
  try {
    const citizenId = Number(req.params.id);
    await citizensService.deleteCitizen(citizenId);
    res.json({ message: 'Citizen deleted' });
  } catch (err) {
    next(err);
  }
};

export const searchCitizensController: RequestHandler = async (req, res, next) => {
  try {
    const filters = {
      firstName: req.query.firstName as string | undefined,
      lastName: req.query.lastName as string | undefined,
      regNumber: req.query.regNumber as string | undefined,
      municipalityName: req.query.municipalityName as string | undefined,
      districtName: req.query.districtName as string | undefined,
      governorateName: req.query.governorateName as string | undefined,
    };
    const results = await citizensService.searchCitizens(filters);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

