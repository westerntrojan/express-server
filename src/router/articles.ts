import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import slugify from 'slugify';

import {articleValidators, commentValidators} from '../utils/validators';
import Article from '../models/Article';
import Comment from '../models/Comment';
import User from '../models/User';

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
					path: 'user'
				}
			})
			.populate('user')
			.populate('category');

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
		const article = await Article.findById(newArticle._id)
			.populate('user')
			.populate('category');

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
					path: 'user'
				}
			})
			.populate('user')
			.populate('category');

		if (!article) {
			return res.json({success: false});
		}

		res.json({success: true, article});
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
				replacement: '-'
			});

			const article = await Article.findByIdAndUpdate(
				req.params.articleId,
				{$set: {...req.body, slug}},
				{new: true}
			)
				.populate('comments', null, null, {
					sort: {created: -1},
					populate: {
						path: 'user'
					}
				})
				.populate('user')
				.populate('category');

			res.json({article});
		} catch (err) {
			next(err);
		}
	}
);

router.delete('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await Article.findByIdAndRemove(req.params.articleId);
		await User.updateMany(
			{likedArticles: req.params.articleId},
			{$pullAll: {likedArticles: [req.params.articleId]}}
		);

		if (article) {
			await Comment.deleteMany({articleId: article._id});

			res.json({article});
		}
	} catch (err) {
		next(err);
	}
});

router.get('/views/:articleId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Article.updateOne({_id: req.params.articleId}, {$inc: {views: 1}});

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

router.get('/like/:articleId/:userId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findById(req.params.userId);

		if (user) {
			if (user.likedArticles.includes(req.params.articleId)) {
				await Promise.all([
					await Article.updateOne({_id: req.params.articleId}, {$inc: {likes: -1}}),
					await User.updateOne(
						{_id: req.params.userId},
						{$pullAll: {likedArticles: [req.params.articleId]}}
					)
				]);

				return res.json({success: false});
			} else {
				await Promise.all([
					await Article.updateOne({_id: req.params.articleId}, {$inc: {likes: 1}}),
					await User.updateOne(
						{_id: req.params.userId},
						{$push: {likedArticles: req.params.articleId}}
					)
				]);
			}
		}

		res.json({success: true});
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
	}
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
			comments: articles.map(article => article.comments.length)
		};

		res.json({data});
	} catch (err) {
		next(err);
	}
});

router.get('/tag/:tag', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const articles = await Article.find({tags: req.params.tag})
			.sort({created: -1})
			.skip(Number(req.query.skip))
			.limit(10)
			.populate('user');

		res.json({articles});
	} catch (err) {
		next(err);
	}
});

export default router;

// router.post('/image', async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const form = new formidable.IncomingForm();

// 		form.parse(req, async (err, fields, files) => {
// 			if (fields.oldImage) {
// 				await cloudinary.v2.uploader.destroy(String(fields.oldImage));
// 			}

// 			const options = {
// 				public_id: `delo/${fields.userId}/articles/${moment().format()}`,
// 				tags: ['article', fields.userId],
// 			};

// 			const {public_id} = await cloudinary.v2.uploader.upload(String(files.image.path), options);

// 			// upload_stream
// 			// const upload_stream = await cloudinary.v2.uploader.upload_stream(options);
// 			// fs.createReadStream(String(files.image.path)).pipe(upload_stream);

// 			res.json({image: public_id});
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// });
