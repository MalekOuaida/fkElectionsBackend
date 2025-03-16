/***************************************************
 * volunteerDriverLeader.routes.ts
 ***************************************************/
import { Router } from 'express';
import {
  createVolunteerController,
  createDriverController,
  createLeaderReferenceController
} from '../controllers/volunteerDriverLeader.controller';

const vdlRouter = Router();

vdlRouter.post('/volunteer', createVolunteerController);
vdlRouter.post('/driver', createDriverController);
vdlRouter.post('/leader', createLeaderReferenceController);

export default vdlRouter;
