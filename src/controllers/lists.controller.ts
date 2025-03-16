// src/controllers/lists.controller.ts

import { RequestHandler } from 'express';
import * as listsService from '../services/lists.service';

// POST /api/lists
export const createListController: RequestHandler = async (req, res, next) => {
  try {
    const { listName } = req.body;
    const listId = await listsService.createList(listName);
    // Don't 'return' the res object
    res.status(201).json({ listId });
  } catch (err) {
    next(err);
  }
};

// GET /api/lists
export const getAllListsController: RequestHandler = async (req, res, next) => {
  try {
    const rows = await listsService.getAllLists();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// POST /api/lists/:listId/candidates
export const createCandidateController: RequestHandler = async (req, res, next) => {
  try {
    const listId = Number(req.params.listId);
    const { candidateId, candidateName } = req.body;
    const newCandidateId = await listsService.createCandidate(listId, candidateId, candidateName);
    res.status(201).json({ listCandidateId: newCandidateId });
  } catch (err) {
    next(err);
  }
};

// GET /api/lists/:listId/candidates
export const getCandidatesByListController: RequestHandler = async (req, res, next) => {
  try {
    const listId = Number(req.params.listId);
    const rows = await listsService.getCandidatesByList(listId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
