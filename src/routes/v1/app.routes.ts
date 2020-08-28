import {Router} from 'express';
import passport from 'passport';

import AppController from '../../controllers/app.controller';

const router = Router();

router.get('/reset', passport.authenticate('isAdmin', {session: false}), AppController.resetApp);

export default router;
