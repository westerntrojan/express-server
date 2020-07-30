import {Router, Request, Response, NextFunction} from 'express';

import {Article, User} from '../models';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	const search_query = String(req.query.search_query);

	const articles = await Article.find({
		$or: [{title: {$regex: search_query, $options: 'i'}}],
	}).limit(5);
	const users = await User.find({
		$or: [
			{firstName: {$regex: search_query, $options: 'i'}},
			{lastName: {$regex: search_query, $options: 'i'}},
			{username: {$regex: search_query, $options: 'i'}},
		],
	}).limit(5);

	res.json({result: {articles, users}});
});

export default router;
