import {Request, Response, Router} from 'express';
import {validationResult} from 'express-validator';

import {articleValidators, commentValidators} from '../utils/validators';

import Article from '../models/Article';
import Comment from '../models/Comment';

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

	res.json({comment});
});

router.delete('/comments/:commentId', async (req: Request, res: Response) => {
	const comment = await Comment.findByIdAndRemove(req.params.commentId);

	res.json({comment});
});

export default router;
