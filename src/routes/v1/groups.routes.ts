import {Router} from 'express';
import passport from 'passport';

import GroupsController from '../../controllers/groups.controller';

const router = Router();

router.get(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	GroupsController.getUserGroups,
);

router.post('/', passport.authenticate('isAuth', {session: false}), GroupsController.create);

export default router;
