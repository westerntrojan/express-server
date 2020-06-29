import {Router, Request, Response, NextFunction} from 'express';

import Article from '../../models/Article';

const router = Router();

router.get('/:tag', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const articles = await Article.find({tags: req.params.tag})
			.sort({created: -1})
			.skip(Number(req.query.skip))
			.limit(10)
			.populate('user')
			.populate({
				path: 'comments',
				options: {
					populate: {
						path: 'replies',
					},
				},
			});

		res.json({articles});
	} catch (err) {
		next(err);
	}
});

export default router;
