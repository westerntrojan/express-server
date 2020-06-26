import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';

import Article from '../models/Article';

const router = Router();

router.get('/top-tags', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tags = [
			'development',
			'news',
			'events',
			'article',
			'random',
			'text',
			'lorem ipsum',
			'other',
			'asd',
			'some tag',
			'people',
			'beautiful',
			'forest',
		];

		res.json({tags});
	} catch (err) {
		next(err);
	}
});

router.get('/top-articles', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const articles = await Article.find().limit(5);

		res.json({articles});
	} catch (err) {
		next(err);
	}
});

router.get(
	'/statistics/articles',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const articles = await Article.find()
				.sort({views: -1})
				.limit(10)
				.populate('comments')
				.populate('category');

			const data = {
				labels: articles.map(article => {
					if (article.title.length > 10) {
						return `${article.title.slice(0, 10)}...`;
					}

					return article.title;
				}),
				views: articles.map(article => article.views),
				comments: articles.map(article => article.comments.length),
			};

			res.json({data});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
