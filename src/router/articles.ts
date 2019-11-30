import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import slugify from 'slugify';

import {articleValidators, commentValidators} from '../utils/validators';
import Article from '../models/Article';
import Comment from '../models/Comment';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const articles = await Article.find()
			.sort({created: -1})
			.skip(Number(req.query.skip))
			.limit(10)
			.populate('comments', null, null, {
				sort: {created: -1},
				populate: {
					path: 'user',
				},
			})
			.populate('user');

		res.json({articles});
	} catch (err) {
		next(err);
	}
});

router.post('/', articleValidators, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({errors: errors.array()});
		}

		const newArticle = await Article.create(req.body);
		const article = await Article.findById(newArticle._id).populate('user');

		res.json({article});
	} catch (err) {
		next(err);
	}
});

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await Article.findOne({slug: req.params.slug})
			.sort({created: -1})
			.populate('comments', null, null, {
				sort: {created: -1},
				populate: {
					path: 'user',
				},
			})
			.populate('user');

		res.json({article});
	} catch (err) {
		next(err);
	}
});

router.put(
	'/:articleId',
	articleValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			const slug = slugify(req.body.title, {
				lower: true,
				replacement: '-',
			});

			const article = await Article.findByIdAndUpdate(
				req.params.articleId,
				{$set: {...req.body, slug}},
				{new: true},
			)
				.populate('comments', null, null, {
					sort: {created: -1},
					populate: {
						path: 'user',
					},
				})
				.populate('user');

			res.json({article});
		} catch (err) {
			next(err);
		}
	},
);

router.delete('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await Article.findByIdAndRemove(req.params.articleId);

		if (article) {
			await Comment.deleteMany({articleId: article._id});

			res.json({article});
		}
	} catch (err) {
		next(err);
	}
});

router.get('/views/:slug', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await Article.findOneAndUpdate(
			{slug: req.params.slug},
			{$inc: {views: 1}},
			{new: true},
		)
			.populate('comments', null, null, {
				sort: {created: -1},
				populate: {
					path: 'user',
				},
			})
			.populate('user');

		res.json({article});
	} catch (err) {
		next(err);
	}
});

router.post(
	'/comments',
	commentValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			let comment = await Comment.create(req.body);

			await Article.updateOne({_id: req.body.articleId}, {$push: {comments: comment._id}});

			comment = await comment.populate('user').execPopulate();

			res.json({comment});
		} catch (err) {
			next(err);
		}
	},
);

router.delete('/comments/:commentId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comment = await Comment.findByIdAndRemove(req.params.commentId);

		res.json({comment});
	} catch (err) {
		next(err);
	}
});

router.get('/get/statistics', async (req: Request, res: Response, next: NextFunction) => {
	const articles = await Article.find()
		.sort({views: -1})
		.limit(10)
		.populate('comments');

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
});

export default router;
