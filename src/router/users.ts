import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import User from '../models/User';
import UserSession from '../models/UserSession';
import getStatistics from '../utils/userStatistics';
import {editUserValidators} from '../utils/validators';

const router = Router();

router.get('/:link', async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = await User.findOne({username: req.params.link});

		if (!user) {
			try {
				user = await User.findOne({_id: req.params.link});
			} catch (err) {
				res.json({success: false});
			}
		}

		if (user) {
			const statistics = await getStatistics(user._id);

			return res.json({success: true, user: {...user.toObject(), ...statistics}});
		}

		res.json({success: false});
	} catch (err) {
		next(err);
	}
});

router.put(
	'/:userId',
	editUserValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			if (req.body.username) {
				const user = await User.findOne({username: req.body.username});

				if (user && String(user._id) !== req.params.userId) {
					return res.json({errors: [{msg: 'Username not available'}]});
				}
			}

			const user = await User.findOneAndUpdate(
				{_id: req.params.userId},
				{$set: {...req.body, username: req.body.username ? req.body.username : ''}},
				{new: true},
			);

			if (user) {
				const statistics = await getStatistics(req.params.userId);

				res.json({user: {...user.toObject(), ...statistics}});
			}
		} catch (err) {
			next(err);
		}
	},
);

router.delete('/:userId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOneAndUpdate(
			{_id: req.params.userId},
			{$set: {isRemoved: true}},
			{new: true},
		);

		if (user) {
			await UserSession.deleteMany({userId: user._id});

			res.json({user});
		}
	} catch (err) {
		next(err);
	}
});

export default router;
