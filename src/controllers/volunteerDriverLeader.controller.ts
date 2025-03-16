/***************************************************
 * volunteerDriverLeader.controller.ts
 ***************************************************/
import { RequestHandler } from 'express';
import * as vdlService from '../services/volunteerDriverLeader.service';

export const createVolunteerController: RequestHandler = async (req, res, next) => {
  try {
    const volId = await vdlService.createVolunteer(req.body);
    res.status(201).json({ volunteerId: volId });
  } catch (err) {
    next(err);
  }
};

export const createDriverController: RequestHandler = async (req, res, next) => {
  try {
    const driverId = await vdlService.createDriver(req.body);
    res.status(201).json({ logisticsDriverId: driverId });
  } catch (err) {
    next(err);
  }
};

export const createLeaderReferenceController: RequestHandler = async (req, res, next) => {
  try {
    const leaderRefId = await vdlService.createLeaderReference(req.body);
    res.status(201).json({ leaderReferenceId: leaderRefId });
  } catch (err) {
    next(err);
  }
};

