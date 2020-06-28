import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';
import formidable from 'formidable';

import User from '../models/User';
import UserChat from '../models/UserChat';
import Message from '../models/Message';
import {uploadImage} from '../utils/images';

const router = Router();

router.get(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
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
	},
);

router.delete(
	'/:chatId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await Promise.all([
				UserChat.deleteOne({_id: req.params.chatId}),
				Message.deleteMany({chatId: req.params.chatId}),
			]);

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.delete(
	'/messages/:chatId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await Message.deleteMany({chatId: req.params.chatId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.post(
	'/image',
	passport.authenticate('isAuth', {session: false}),
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const form = new formidable.IncomingForm();

			form.parse(req, async (err, fields, files) => {
				if (err) {
					return res.json({success: false, message: 'Error. Try again'});
				}

				const result = await uploadImage(files.image);

				if (!result.success) {
					return res.json({success: false, message: result.message});
				}

				res.json({success: true, image: result.public_id});
			});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
