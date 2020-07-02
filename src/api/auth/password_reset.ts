import {Router, Request, Response, NextFunction} from 'express';
import passport from 'passport';

import User from '../../models/User';
import {sendEmail} from '../../utils/email';

const router = Router();

router.post(
	'/',
	passport.authenticate('passwordResetVerify', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {password} = req.body;

			const user = await User.findOne({_id: req.user, emailVerified: true});

			if (!user) {
				return res.json({success: false, message: 'User not found'});
			}

			const correctPassword = await user.validatePassword(password);

			if (correctPassword) {
				return res.json({
					success: false,
					message: 'The current password will match the past. Please enter another',
				});
			}

			user.password = await user.hashPassword(password);
			await user.save();

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.post('/email', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({email: req.body.email, emailVerified: true});

		if (!user) {
			return res.json({success: false, message: 'User not found'});
		}

		const token = user.generateToken();
		const html = `
			<a href="${process.env.CLIENT_URI}/password_reset/verify/${token}">Link</a>
			<br/>
			<br/>
			You can use the following link to reset your password: ${process.env.CLIENT_URI}/password_reset/verify/${token}
		`;
		const result = await sendEmail(user.email, 'Please reset your password', '', html);

		if (!result) {
			return res.json({success: false});
		}

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

router.get(
	'/verify',
	passport.authenticate('passwordResetVerify', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({success: true, userId: req.user});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
