import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import passport from 'passport';

import {upload, removeImage, getImageUrl} from '../utils/images';
import {getNotFoundError} from '../utils/errors';
import User from '../models/User';
import {getUserByLink, getUserStatistics} from '../utils/users';
import {editUserValidators} from '../utils/validators';
import {optimizeImage} from '../middleware';

const router = Router();

router.get('/:userLink', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await getUserByLink(req.params.userLink);

		if (!user) {
			const notFoundError = getNotFoundError();

			return res.status(404).json(notFoundError);
		}

		const statistics = await getUserStatistics(user._id);

		return res.json({success: true, user: {...user.toObject(), statistics}});
	} catch (err) {
		next(err);
	}
});

router.put(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	editUserValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, messages: errors.array()[0].msg});
			}

			if (req.body.username) {
				const user = await User.findOne({username: req.body.username});

				if (user && String(user._id) !== req.params.userId) {
					return res.json({success: false, message: 'Username not available'});
				}
			}

			const user = await User.findOneAndUpdate(
				{_id: req.params.userId},
				{$set: {...req.body}},
				{new: true},
			);

			res.json({success: true, user});
		} catch (err) {
			next(err);
		}
	},
);

router.delete(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await User.updateOne({_id: req.params.userId}, {$set: {isRemoved: true}});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.get(
	'/two_factor_auth/:userId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.params.userId);

			if (!user) {
				return res.json({success: false, message: 'User not found'});
			}

			user.twoFactorAuth = !user.twoFactorAuth;
			await user.save();

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

const avatarUpload = upload.single('avatar');

router.post(
	'/avatar',
	passport.authenticate('isAuth', {session: false}),
	avatarUpload,
	optimizeImage,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const imageUrl = getImageUrl(req);

			(async function addAvatar(): Promise<void> {
				const user = await User.findById(req.body.userId);

				if (user) {
					user.avatar.images.unshift(imageUrl);

					await user.save();
				}
			})();

			res.json({success: true, imageUrl});
		} catch (err) {
			next(err);
		}
	},
);

router.post(
	'/avatar/remove',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.body.userId);

			if (user) {
				await User.updateOne(
					{_id: req.body.userId},
					{$pullAll: {'avatar.images': [req.body.imageUrl]}},
				);

				removeImage(req.body.imageUrl);

				res.json({success: true});
			}
		} catch (err) {
			next(err);
		}
	},
);

export default router;
