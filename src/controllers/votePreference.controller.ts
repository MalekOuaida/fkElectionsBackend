/*****************************************
 * votePreference.controller.ts
 *****************************************/
import { RequestHandler } from 'express';
import * as vpService from '../services/votePreference.service';

export const createVotePreferenceController: RequestHandler = async (req, res, next) => {
  try {
    const vpId = await vpService.createVotePreference(req.body);
    res.status(201).json({ votePreferenceId: vpId });
  } catch (err) {
    next(err);
  }
};

export const upsertVotePreferenceController: RequestHandler = async (req, res, next) => {
  try {
    const vpId = await vpService.upsertVotePreference(req.body);
    res.json({ votePreferenceId: vpId });
  } catch (err) {
    next(err);
  }
};

export const getPreferencesByCitizenController: RequestHandler = async (req, res, next) => {
  try {
    const cId = Number(req.params.citizenId);
    const rows = await vpService.getPreferencesByCitizen(cId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};