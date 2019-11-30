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
				if (chat.removeFor !== req.params.userId) {
					const lastMessage = await Message.findOne({chatId: chat._id}).sort({created: -1});

					if (req.params.userId === String(chat.from)) {
						const user = await User.findById(chat.to);

						return {...chat.toObject(), user, lastMessage};
					}

					const user = await User.findById(chat.from);

					return {...chat.toObject(), user, lastMessage};
				}

				return null;
			}),
		);

		res.json({chats});
	} catch (err) {
		next(err);
	}
});

router.get('/users/:userId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({_id: req.params.userId, isRemoved: false});

		if (user) {
			res.json({user});
		}
	} catch (err) {
		next(err);
	}
});

router.delete('/remove/:chatId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserChat.deleteOne({_id: req.params.chatId});
		await Message.deleteMany({chatId: req.params.chatId});

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

router.delete(
	'/remove/messages/:chatId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await Message.deleteMany({chatId: req.params.chatId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.delete(
	'/remove/:chatId/:userId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const chat = await UserChat.findById(req.params.chatId);

			if (chat) {
				if (chat.removeFor) {
					await UserChat.deleteOne({_id: req.params.chatId});
					await Message.deleteMany({chatId: req.params.chatId});
				} else {
					await UserChat.updateOne(
						{_id: req.params.chatId},
						{$set: {removeFor: req.params.userId}},
					);

					const messages = await Message.find({chatId: req.params.chatId});

					messages.forEach(async message => {
						if (message.removeFor) {
							await Message.deleteOne({_id: message._id});
						} else {
							await Message.updateOne({_id: message._id}, {$set: {removeFor: req.params.userId}});
						}
					});
				}
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.delete(
	'/remove/messages/:chatId/:userId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const messages = await Message.find({chatId: req.params.chatId});

			messages.forEach(async message => {
				if (message.removeFor) {
					await Message.deleteOne({_id: message._id});
				} else {
					await Message.updateOne({_id: message._id}, {$set: {removeFor: req.params.userId}});
				}
			});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
