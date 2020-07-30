import {Router, Request, Response, NextFunction} from 'express';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
	try {
		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

export default router;
