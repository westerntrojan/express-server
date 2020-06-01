import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import {articleValidators, commentValidators} from '../utils/validators';
import {upload, removeImage, getImageUrl} from '../utils/images';
import {getNotFoundError} from '../utils/errors';
import Article from '../models/Article';
import Comment from '../models/Comment';
import {removeArticle, addLike} from '../utils/articles';
import {getSlug} from '../utils/app';

const router = Router();

const imageUpload = upload.single('image');

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const skip = Number(req.query.skip) || 0;

		const articles = await Article.find()
			.sort({created: -1})
			.skip(skip)
			.limit(10)
			.populate('comments', null, null, {
				sort: {created: -1},
				populate: {
					path: 'user',
				},
			})
			.populate('user')
			.populate('category');

		res.json({articles});
	} catch (err) {
		next(err);
	}
});

router.post(
	'/',
	imageUpload,
	articleValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			const imageUrl = getImageUrl(req);

			const newArticle = await Article.create({
				...req.body,
				tags: JSON.parse(req.body.tags),
				image: imageUrl,
				user: req.body.userId,
			});
			const article = await Article.findById(newArticle._id)
				.populate('user')
				.populate('category');

			res.json({article});
		} catch (err) {
			next(err);
		}
	},
);

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
			.populate('user')
			.populate('category');

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
	imageUpload,
	articleValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			const slug = getSlug(req.body.title);

			const imageUrl = getImageUrl(req);

			// remove old image
			if (!imageUrl) {
				const article = await Article.findById(req.params.articleId);

				if (article) {
					removeImage(article.image);
				}
			}

			const article = await Article.findByIdAndUpdate(
				req.params.articleId,
				{
					$set: {
						...req.body,
						slug,
						tags: JSON.parse(req.body.tags),
						image: imageUrl,
						user: req.body.userId,
					},
				},
				{new: true},
			)
				.populate('comments', null, null, {
					sort: {created: -1},
					populate: {
						path: 'user',
					},
				})
				.populate('user')
				.populate('category');

			res.json({article});
		} catch (err) {
			next(err);
		}
	},
);

router.delete('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const article = await removeArticle(req.params.articleId);

		if (article) {
			removeImage(article.image);
		}

		res.json({article});
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
		const success = await addLike(req.params.articleId, req.params.userId);

		res.json({success});
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
				return res.json({success: false, message: errors.array()[0].msg});
			}

			let comment = await Comment.create(req.body);
			comment = await comment.populate('user').execPopulate();

			await Article.updateOne({_id: req.body.articleId}, {$push: {comments: comment._id}});

			res.json({success: true, comment});
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

router.get('/comments/like/:commentId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const success = await Comment.updateOne({_id: req.params.commentId}, {$inc: {likes: 1}});

		res.json({success});
	} catch (err) {
		next(err);
	}
});

router.get(
	'/comments/dislike/:commentId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const success = await Comment.updateOne({_id: req.params.commentId}, {$inc: {dislikes: 1}});

			res.json({success});
		} catch (err) {
			next(err);
		}
	},
);

router.post('/comments/add', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comment = await Comment.create(req.body);

		await Article.updateOne({_id: req.body.articleId}, {$push: {comments: comment._id}});

		res.json({comment});
	} catch (err) {
		next(err);
	}
});

router.get('/comments/get', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comments = await Comment.find({parentId: null}).sort({created: -1});
		const replies = await Comment.find({parentId: {$ne: null}}).sort({created: -1});

		const newComments = comments.map(comment => {
			replies.forEach(reply => {
				if (comment._id === reply.parentId) {
					console.log(comment._id + ' = ' + reply._id);
				}
			});

			return comment;
		});

		res.json({newComments});
	} catch (err) {
		next(err);
	}
});

export default router;
