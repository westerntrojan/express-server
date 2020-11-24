import {Router} from 'express';
import passport from 'passport';

import ChatsController from '../../controllers/chats.controller';

const router = Router();

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

router.delete(
	'/messages/:chatId',
	passport.authenticate('isAuth', {session: false}),
	ChatsController.removeChatMessages,
);

export default router;
