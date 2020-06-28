import {Request, Response, Router, NextFunction} from 'express';
import passport from 'passport';
import formidable from 'formidable';

import {getNotFoundError} from '../../utils/errors';
import Article from '../../models/Article';
import {removeArticle} from '../../utils/articles';
import {getSlug} from '../../utils/app';
import {uploadImage, removeImage} from '../../utils/images';
import commentsRouter from './comments';
import bookmarksRouter from './bookmarks';
import tagRouter from './tag';
import viewsRouter from './views';
import likeRouter from './like';
import dislikeRouter from './dislike';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skip = Number(req.query.skip) || 0;

		const articles = await Article.find()
			.sort({created: -1})
			.skip(skip)
			.limit(10)
			.populate('user category')
			.populate({
				path: 'comments',
				options: {
					sort: {created: -1},
					populate: {
						path: 'user replies',
						options: {
							sort: {created: 1},
							populate: {
								path: 'user',
							},
						},
					},
				},
			});

		res.json({articles});
	} catch (err) {
		next(err);
	}
});

router.post(
	'/',
	passport.authenticate('isAuth', {session: false}),
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const form = new formidable.IncomingForm();

			form.parse(req, async (err, fields: any, files) => {
				if (err) {
					return res.json({success: false, message: 'Error. Try again'});
				}

				const result = await uploadImage(files.image);

				if (!result.success) {
					return res.json({success: false, message: result.message});
				}

				const newArticle = await Article.create({
					...fields,
					tags: JSON.parse(fields.tags),
					image: result.public_id,
					user: fields.userId,
				});

				const article = await Article.findById(newArticle._id).populate('user category');

				res.json({article});
			});
		} catch (err) {
			next(err);
		}
	},
);

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await Article.findOne({slug: req.params.slug})
			.sort({created: -1})
			.populate('user category')
			.populate({
				path: 'comments',
				options: {
					sort: {created: -1},
					populate: {
						path: 'user replies',
						options: {
							sort: {created: 1},
							populate: {
								path: 'user',
							},
						},
					},
				},
			});

		if (!article) {
			const notFoundError = getNotFoundError();

			return res.status(404).json(notFoundError);
		}

		res.json({success: true, article});
	} catch (err) {
		next(err);
	}
});

router.put(
	'/:articleId',
	passport.authenticate('isAuth', {session: false}),
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const form = new formidable.IncomingForm();

			form.parse(req, async (err, fields: any, files) => {
				if (err) {
					return res.json({success: false, message: 'Error. Try again'});
				}

				const slug = getSlug(fields.title);

				let image = fields.image;

				if (files.image) {
					const article = await Article.findById(req.params.articleId);

					if (article) {
						if (article.image) {
							await removeImage(article.image);
						}
					}

					const result = await uploadImage(files.image);

					if (!result.success) {
						return res.json({success: false, message: result.message});
					}

					image = result.public_id;
				}

				if (!image) {
					const article = await Article.findById(req.params.articleId);

					if (article) {
						if (article.image !== image) {
							await removeImage(article.image);
						}
					}
				}

				const article = await Article.findByIdAndUpdate(
					req.params.articleId,
					{
						$set: {
							...fields,
							slug,
							tags: JSON.parse(fields.tags),
							image,
							user: fields.userId,
						},
					},
					{new: true},
				)
					.populate('user category')
					.populate('comments', null, null, {
						sort: {created: -1},
						populate: {
							path: 'user',
						},
					});

				res.json({article});
			});
		} catch (err) {
			next(err);
		}
	},
);

router.delete(
	'/:articleId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const article = await removeArticle(req.params.articleId);

			if (article) {
				await removeImage(article.image);
			}

			res.json({article});
		} catch (err) {
			next(err);
		}
	},
);

router.use('/comments', commentsRouter);
router.use('/bookmarks', bookmarksRouter);
router.use('/tag', tagRouter);
router.use('/views', viewsRouter);
router.use('/like', likeRouter);
router.use('/dislike', dislikeRouter);

export default router;
