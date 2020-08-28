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
	ChatsController.deleteChat,
);

router.delete(
	'/messages/:chatId',
	passport.authenticate('isAuth', {session: false}),
	ChatsController.deleteChatMessages,
);

router.post('/image', passport.authenticate('isAuth', {session: false}), ChatsController.addImage);

export default router;
