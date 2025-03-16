/********************************************
 * electionData.controller.ts
 ********************************************/
import { RequestHandler } from 'express';
import * as edService from '../services/electionData.service';

export const createElectionYearController: RequestHandler = async (req, res, next) => {
  try {
    const { year } = req.body;
    const yId = await edService.createElectionYear(year);
    res.status(201).json({ electionYearId: yId });
  } catch (err) {
    next(err);
  }
};

export const getAllElectionYearsController: RequestHandler = async (req, res, next) => {
  try {
    const rows = await edService.getAllElectionYears();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const createElectionTypeController: RequestHandler = async (req, res, next) => {
  try {
    const { typeName } = req.body;
    const tId = await edService.createElectionType(typeName);
    res.status(201).json({ electionTypeId: tId });
  } catch (err) {
    next(err);
  }
};

export const createElectionDistrictController: RequestHandler = async (req, res, next) => {
  try {
    const { districtName } = req.body;
    const edId = await edService.createElectionDistrict(districtName);
    res.status(201).json({ electionDistrictId: edId });
  } catch (err) {
    next(err);
  }
};