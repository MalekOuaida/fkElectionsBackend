/*****************************************
 * votePreference.routes.ts
 *****************************************/
import { Router } from 'express';
import {
  createVotePreferenceController,
  upsertVotePreferenceController,
  getPreferencesByCitizenController
} from '../controllers/votePreference.controller';

const votePreferenceRouter = Router();

votePreferenceRouter.post('/', createVotePreferenceController);
votePreferenceRouter.post('/upsert', upsertVotePreferenceController);
votePreferenceRouter.get('/citizen/:citizenId', getPreferencesByCitizenController);

export default votePreferenceRouter;
