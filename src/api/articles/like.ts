import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';

import Article from '../../models/Article';

const router = Router();

router.get(
	'/:articleId',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const success = await Article.updateOne({_id: req.params.articleId}, {$inc: {likes: 1}});

			res.json({success});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
