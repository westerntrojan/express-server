import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';

const router = Router();

router.get(
	'/',
	passport.authenticate('isAuth', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({success: true, user: req.user});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
