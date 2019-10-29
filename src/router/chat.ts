import {Router, Request, Response, NextFunction} from 'express';

import User from '../models/User';
import UserChat from '../models/UserChat';

const router = Router();

router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const chats = await UserChat.find({
			$or: [{from: req.params.userId}, {to: req.params.userId}],
		})
			.populate('from')
			.populate('to');

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

export default router;
