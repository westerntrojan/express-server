import {Router} from 'express';

import CloudController from '../../controllers/cloud.controller';

const router = Router();

router.delete('/:resource_type', CloudController.deleteResource);

export default router;
