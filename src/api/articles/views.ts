import {Router, Request, Response, NextFunction} from 'express';

import Article from '../../models/Article';

const router = Router();

router.get('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Article.updateOne({_id: req.params.articleId}, {$inc: {views: 1}});

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

export default router;
