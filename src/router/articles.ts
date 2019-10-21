import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import {articleValidators, commentValidators} from '../utils/validators';

import Article from '../models/Article';
import Comment from '../models/Comment';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const articles = await Article.find()
			.sort({created: -1})
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

		const vaidationArticle = await Article.findOne({title: req.body.title});
		if (vaidationArticle) {
			return res.json({errors: [{msg: 'Article with the same title already exists'}]});
		}

		const article = await Article.create(req.body);

		res.json({article});
	} catch (err) {
		next(err);
	}
});

router.get('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await Article.findById(req.params.articleId)
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

			const vaidationArticle = await Article.findOne({title: req.body.title});
			if (vaidationArticle) {
				return res.json({errors: [{msg: 'Article with the same title already exists'}]});
			}

			const slug = req.body.title
				.split(' ')
				.join('-')
				.toLowerCase();

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
		await Comment.remove({articleId: req.params.articleId});

		res.json({article});
	} catch (err) {
		next(err);
	}
});

router.get('/views/:slug', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await Article.findOne({slug: req.params.slug})
			.populate('comments', null, null, {
				sort: {created: -1},
				populate: {
					path: 'user',
				},
			})
			.populate('user');

		if (article) {
			article.views = article.views + 1;
			article.save();
		}

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
			const article = await Article.findById(req.body.articleId);

			if (article) {
				article.comments.push(comment._id);
				await article.save();
			}

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

export default router;
