import {Router} from 'express';
import passport from 'passport';

import DataController from '../../controllers/data.controller';

const router = Router();

router.get(
	'/statistics/articles',
	passport.authenticate('isAdmin', {session: false}),
	DataController.getArticleStatistics,
);

export default router;
