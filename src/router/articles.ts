import {Request, Response, Router} from 'express';
import {validationResult} from 'express-validator';

import {articleValidators, commentValidators} from '../utils/validators';

import Article from '../models/Article';
import Comment from '../models/Comment';
import User from '../models/User';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
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
});

router.post('/', articleValidators, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const article = await Article.create(req.body);

	const user: any = await User.findById(req.body.user);
	user.articles = user.articles + 1;
	user.save();

	res.json({article});
});

router.get('/:articleId', async (req: Request, res: Response) => {
	const article = await Article.findById(req.params.articleId)
		.populate('comments', null, null, {
			sort: {created: -1},
			populate: {
				path: 'user',
			},
		})
		.populate('user');

	res.json({article});
});

router.put('/:articleId', articleValidators, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const article = await Article.findByIdAndUpdate(
		req.params.articleId,
		{$set: req.body},
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
});

router.delete('/:articleId', async (req: Request, res: Response) => {
	const article: any = await Article.findByIdAndRemove(req.params.articleId);
	await Comment.remove({articleId: req.params.articleId});

	const user: any = await User.findById(article.user._id);
	user.articles = user.articles - 1;
	user.save();

	res.json({article});
});

router.get('/views/:articleId', async (req: Request, res: Response) => {
	const article: any = await Article.findById(req.params.articleId)
		.populate('comments', null, null, {
			sort: {created: -1},
			populate: {
				path: 'user',
			},
		})
		.populate('user');

	article.views = article.views + 1;
	article.save();

	res.json({article});
});

router.post('/comments', commentValidators, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	let comment = await Comment.create(req.body);
	const article: any = await Article.findById(req.body.articleId);

	article.comments.push(comment._id);
	await article.save();

	comment = await comment.populate('user').execPopulate();

	const user: any = await User.findById(req.body.user);
	user.comments = user.comments + 1;
	await user.save();

	res.json({comment});
});

router.delete('/comments/:commentId', async (req: Request, res: Response) => {
	const comment: any = await Comment.findByIdAndRemove(req.params.commentId);

	const user: any = await User.findById(comment.user._id);
	user.comments = user.comments - 1;
	user.save();

	res.json({comment});
});

export default router;
