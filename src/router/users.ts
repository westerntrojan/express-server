import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import {upload, removeImage} from '../utils/images';

import User from '../models/User';
import UserSession from '../models/UserSession';
import {getUserByLink, getUserStatistics, getAvatar} from '../utils/users';
import {editUserValidators} from '../utils/validators';
import {getImageUrl} from '../utils/images';

const router = Router();

router.get('/:userLink', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await getUserByLink(req.params.userLink);

		if (user) {
			const statistics = await getUserStatistics(user._id);
			const avatar = await getAvatar(user._id);

			return res.json({success: true, user: {...user.toObject(), statistics, avatar}});
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
				{$set: {...req.body}},
				{new: true}
			);

			res.json({user});
		} catch (err) {
			next(err);
		}
	}
);

router.delete('/:userId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOneAndUpdate(
			{_id: req.params.userId},
			{$set: {isRemoved: true}},
			{new: true}
		);

		if (user) {
			await UserSession.deleteMany({userId: user._id});

			res.json({user});
		}
	} catch (err) {
		next(err);
	}
});

const avatarUpload = upload.single('avatar');

router.post('/avatar', async (req: Request, res: Response, next: NextFunction) => {
	try {
		avatarUpload(req, res, err => {
			if (err) {
				return res.json({errors: [{msg: err.message}]});
			}

			const imageUrl = getImageUrl(req);

			(async (): Promise<void> => {
				await User.updateOne({_id: req.body.userId}, {$push: {'avatar.images': imageUrl}});
			})();

			res.json({image: imageUrl});
		});
	} catch (err) {
		next(err);
	}
});

router.post('/avatar/remove', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.body.userId);

		if (user) {
			await User.updateOne(
				{_id: req.body.userId},
				{$pullAll: {'avatar.images': [req.body.imageUrl]}}
			);

			removeImage(req.body.imageUrl);

			res.json({success: true, image: req.body.imageUrl});
		}
	} catch (err) {
		next(err);
	}
});

export default router;
