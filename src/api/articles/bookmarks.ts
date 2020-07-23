import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';

import Article, {IArticle} from '../../models/Article';
import User from '../../models/User';

const router = Router();

router.get(
	'/:userId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.params.userId);

			if (user) {
				const articles: IArticle[] = [];

				await Promise.all(
					user.bookmarks.map(async (articleId: string) => {
						const article = await Article.findById(articleId).populate('user');

						if (article) {
							articles.push(article);
						}
					}),
				);

				return res.json({success: true, articles});
			}

			res.json({success: false, message: 'User not found'});
		} catch (err) {
			next(err);
		}
	},
);

router.get(
	'/:articleId/:userId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.params.userId);

			if (user) {
				if (user.bookmarks.includes(req.params.articleId)) {
					await Promise.all([
						Article.updateOne({_id: req.params.articleId}, {$inc: {bookmarksCount: -1}}),
						User.updateOne(
							{_id: req.params.userId},
							{$pullAll: {bookmarks: [req.params.articleId]}},
						),
					]);

					return res.json({success: true, removed: true});
				}

				await Promise.all([
					Article.updateOne({_id: req.params.articleId}, {$inc: {bookmarksCount: 1}}),
					User.updateOne({_id: req.params.userId}, {$push: {bookmarks: req.params.articleId}}),
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
