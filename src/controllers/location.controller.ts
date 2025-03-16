/*************************
 * location.controller.ts
 *************************/
import { RequestHandler } from 'express';
import * as locationService from '../services/location.service';

export const createGovernorateController: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const govId = await locationService.createGovernorate(name);
    res.status(201).json({ governorateId: govId });
  } catch (err) {
    next(err);
  }
};

export const createDistrictController: RequestHandler = async (req, res, next) => {
  try {
    const { name, governorateId } = req.body;
    const distId = await locationService.createDistrict(name, governorateId);
    res.status(201).json({ districtId: distId });
  } catch (err) {
    next(err);
  }
};

export const createMunicipalityController: RequestHandler = async (req, res, next) => {
  try {
    const { name, districtId } = req.body;
    const munId = await locationService.createMunicipality(name, districtId);
    res.status(201).json({ municipalityId: munId });
  } catch (err) {
    next(err);
  }
};

export const getMunicipalityDetailsController: RequestHandler = async (req, res, next) => {
  try {
    const munId = Number(req.params.id);
    const info = await locationService.getMunicipalityDetails(munId);
    if (!info) {
      res.status(404).json({ error: 'Municipality not found' });
      return;
    }
    res.json(info);
  } catch (err) {
    next(err);
  }
};
