import {Router, Request, Response, NextFunction} from 'express';

import User from '../models/User';
import UserChat from '../models/UserChat';
import Message from '../models/Message';

const router = Router();

router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userChats = await UserChat.find({
			$or: [{from: req.params.userId}, {to: req.params.userId}],
		});

		const chats = await Promise.all(
			userChats.map(async chat => {
				const lastMessage = await Message.findOne({chatId: chat._id}).sort({created: -1});

				if (req.params.userId === String(chat.from)) {
					const user = await User.findById(chat.to);

					return {...chat.toObject(), user, lastMessage};
				}

				const user = await User.findById(chat.from);

				return {...chat.toObject(), user, lastMessage};
			}),
		);

		res.json({chats});
	} catch (err) {
		next(err);
	}
});

router.delete('/:chatId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Promise.all([
			UserChat.deleteOne({_id: req.params.chatId}),
			Message.deleteMany({chatId: req.params.chatId}),
		]);

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

router.delete('/messages/:chatId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Message.deleteMany({chatId: req.params.chatId});

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

export default router;
