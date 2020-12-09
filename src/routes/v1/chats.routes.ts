import {Router} from 'express';
import passport from 'passport';

import ChatsController from '../../controllers/chats.controller';

const router = Router();

router.get(
	'/id/:user1/:user2',
	passport.authenticate('isAuth', {session: false}),
	ChatsController.getChatId,
);

router.get(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	ChatsController.getUserChats,
);

router.delete(
	'/:chatId',
	passport.authenticate('isAuth', {session: false}),
	ChatsController.removeChat,
);

export default router;
