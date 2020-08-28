import {Router} from 'express';
import passport from 'passport';

import UsersController from '../../controllers/users.controller';
import {editUserValidators} from '../../middlewares/validators';

const router = Router();

router.get('/:userLink', UsersController.getUserByLink);

router.put(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	editUserValidators,
	UsersController.updateUser,
);

router.delete(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	UsersController.deleteUser,
);

router.get(
	'/two_factor_auth/:userId',
	passport.authenticate('isAuth', {session: false}),
	UsersController.setTwoFactorAuth,
);

router.post(
	'/avatar/remove',
	passport.authenticate('isAuth', {session: false}),
	UsersController.deleteAvatar,
);

router.post(
	'/avatar',
	passport.authenticate('isAuth', {session: false}),
	UsersController.addAvatar,
);

export default router;
