/********************************************
 * electionData.routes.ts
 ********************************************/
import { Router } from 'express';
import {
  createElectionYearController,
  getAllElectionYearsController,
  createElectionTypeController,
  createElectionDistrictController
} from '../controllers/electionData.controller';

const electionDataRouter = Router();

electionDataRouter.post('/year', createElectionYearController);
electionDataRouter.get('/years', getAllElectionYearsController);
electionDataRouter.post('/type', createElectionTypeController);
electionDataRouter.post('/district', createElectionDistrictController);

export default electionDataRouter;
