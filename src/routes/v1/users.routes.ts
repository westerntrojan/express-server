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
	UsersController.removeUser,
);

router.get(
	'/two_factor_auth/:userId',
	passport.authenticate('isAuth', {session: false}),
	UsersController.setTwoFactorAuth,
);

router.post(
	'/avatar/remove',
	passport.authenticate('isAuth', {session: false}),
	UsersController.removeAvatar,
);

router.post(
	'/avatar',
	passport.authenticate('isAuth', {session: false}),
	UsersController.addAvatar,
);

router.post('/follow', passport.authenticate('isAuth', {session: false}), UsersController.follow);

router.post(
	'/unfollow',
	passport.authenticate('isAuth', {session: false}),
	UsersController.unfollow,
);

router.get(
	'/following/:userId',
	passport.authenticate('isAuth', {session: false}),
	UsersController.following,
);

router.get(
	'/bookmarks/:userId',
	passport.authenticate('isAuth', {session: false}),
	UsersController.getBookmarks,
);

export default router;
