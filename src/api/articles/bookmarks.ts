import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';

import Article from '../../models/Article';
import User from '../../models/User';

const router = Router();

router.get(
	'/:articleId/:userId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.body.userId);

			if (user) {
				if (user.bookmarks.includes(req.body.articleId)) {
					await Promise.all([
						Article.updateOne({_id: req.body.articleId}, {$inc: {bookmarksCount: -1}}),
						User.updateOne({_id: req.body.userId}, {$pullAll: {bookmarks: [req.body.articleId]}}),
					]);

					return res.json({success: true, removed: true});
				}

				await Promise.all([
					Article.updateOne({_id: req.body.articleId}, {$inc: {bookmarksCount: 1}}),
					User.updateOne({_id: req.body.userId}, {$push: {bookmarks: req.body.articleId}}),
				]);

				return res.json({success: true, added: true});
			}

			res.json({success: false, message: 'User not found'});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
