import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import User from '../models/User';
import getStatistics from '../utils/userStatistics';
import {editUserValidators} from '../utils/validators';

const router = Router();

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({slug: req.params.slug, isRemoved: false});

		if (user) {
			const statistics = await getStatistics(user._id);

			res.json({user: {...user._doc, ...statistics}});
		}
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

			const slug = req.body.username.toLowerCase();

			const user = await User.findOneAndUpdate(
				{_id: req.params.userId},
				{$set: {...req.body, slug}},
				{new: true},
			);

			if (user) {
				const statistics = await getStatistics(req.params.userId);

				res.json({user: {...user._doc, ...statistics}});
			}
		} catch (err) {
			next(err);
		}
	},
);

export default router;
