// src/routes/lists.routes.ts

import { Router } from 'express';
import {
  createListController,
  getAllListsController,
  createCandidateController,
  getCandidatesByListController
} from '../controllers/lists.controller';

// This is your Express router for lists
const listsRouter = Router();

// POST /api/lists
listsRouter.post('/', createListController);

// GET /api/lists
listsRouter.get('/', getAllListsController);

// POST /api/lists/:listId/candidates
listsRouter.post('/:listId/candidates', createCandidateController);

// GET /api/lists/:listId/candidates
listsRouter.get('/:listId/candidates', getCandidatesByListController);

export default listsRouter;
