// src/routes/index.ts
import { Router } from 'express';

import citizensRouter from './citizens.routes';
import citizenAttribRouter from './citizenAttrib.routes';
import locationRouter from './location.routes';
import referencesRouter from './references.routes';
import systemUsersRouter from './systemUsers.routes';
import volunteerDriverLeaderRouter from './volunteerDriverLeader.routes';
import votePreferenceRouter from './votePreference.routes';
import relativesServicesRouter from './relativesAndServices.routes';
import electionDataRouter from './electionData.routes';
import listsRouter from './lists.routes';
import mukhtarRouter from './mukhtar.routes';
import addressRouter from './address.routes';
import serviceTypeRouter from './serviceType.routes';
import serviceStatusRouter from './serviceStatus.routes';

const router = Router();

router.use('/citizens', citizensRouter);
router.use('/citizen-attrib', citizenAttribRouter);
router.use('/location', locationRouter);
router.use('/references', referencesRouter);
router.use('/users', systemUsersRouter);
router.use('/vdl', volunteerDriverLeaderRouter);
router.use('/vote-preference', votePreferenceRouter);
router.use('/relatives-services', relativesServicesRouter);
router.use('/election-data', electionDataRouter);
router.use('/lists', listsRouter);
router.use('/mukhtar', mukhtarRouter);
router.use('/address', addressRouter);
router.use('/service-type', serviceTypeRouter);
router.use('/service-status', serviceStatusRouter);

// Handle 404 if no route matches
router.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default router;
