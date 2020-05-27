import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';

import User from '../../models/User';
import AuthCode from '../../models/AuthCode';
import {sendEmail} from '../../utils/email';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		return passport.authenticate('login', {session: false}, async (err, user, info) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				return res.json({success: false, message: info.message});
			}

			if (user.twoFactorAuth) {
				const code = Math.floor(100000 + Math.random() * 900000); // Example - 341772
				const text = `Code: ${code}`;
				const result = await sendEmail(user.email, 'Your verification code', text);

				if (result) {
					await AuthCode.create({userId: user._id, code});

					return res.json({success: false, twoFactorAuth: true, userId: user._id});
				}
			}

			return res.json({success: true, user: user.getValidUser(), token: user.generateToken()});
		})(req, res, next);
	} catch (err) {
		next(err);
	}
});

router.post('/code', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {userId, code} = req.body;

		const authCode = await AuthCode.findOne({userId, code});
		const user = await User.findById(userId);

		if (!authCode || !user) {
			return res.json({success: false, message: 'Invalid verification code'});
		}

		await AuthCode.deleteOne({userId, code});

		res.json({success: true, user: user.getValidUser(), token: user.generateToken()});
	} catch (err) {
		next(err);
	}
});

export default router;
