import {Router, Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import passport from 'passport';
import randomColor from 'randomcolor';
import jwt from 'jsonwebtoken';

import {User, AuthCode} from '../models';
import {registerValidators} from '../utils/validators';
import {sendEmail} from '../utils/email';

const router = Router();

const isTest = process.env.NODE_ENV === 'test';

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
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
					await AuthCode.create({userId: user._id, code: code.toString()});

					return res.json({success: false, twoFactorAuth: true, userId: user._id});
				}
			}

			return res.json({success: true, user: user.getValidUser(), token: user.generateToken()});
		})(req, res, next);
	} catch (err) {
		next(err);
	}
});

router.post('/login/code', async (req: Request, res: Response, next: NextFunction) => {
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

router.post(
	'/register',
	registerValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			const user = await User.findOne({email: req.body.email, isRemoved: false});

			if (user) {
				return res.json({success: false, message: 'User exists'});
			}

			const newUser = new User({...req.body, emailVerified: isTest});
			newUser.password = await newUser.hashPassword(req.body.password);
			newUser.avatar.color = randomColor({luminosity: 'dark', format: 'rgb'});
			await newUser.save();

			if (!isTest) {
				const token = newUser.generateToken();
				const html = `
				<a href="${process.env.CLIENT_URI}/register/verify/${token}">Link</a>
				<br/>
				<br/>
				Or, copy and paste the following URL into your browser: ${process.env.CLIENT_URI}/register/verify/${token}
			`;
				const result = await sendEmail(newUser.email, 'Verify your email', '', html);

				if (!result) {
					return res.json({success: false, message: 'Something went wrong. Try logging in later'});
				}
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.get(
	'/register/verify',
	passport.authenticate('registerVerify', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

router.post(
	'/password_reset',
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

router.post('/password_reset/email', async (req: Request, res: Response, next: NextFunction) => {
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
	'/password_reset/verify',
	passport.authenticate('passwordResetVerify', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({success: true, userId: req.user});
		} catch (err) {
			next(err);
		}
	},
);

router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.headers.authorization) {
			const token = req.headers.authorization.slice(7);

			try {
				const decoded: any = jwt.verify(String(token), String(process.env.JWT_SIGNATURE));

				const user = await User.findOne({
					_id: decoded.data.userId,
					emailVerified: true,
					isRemoved: false,
				});

				if (!user) {
					return res.json({success: false});
				}

				return res.json({success: true, user: user.getValidUser()});
			} catch (err) {
				return res.json({success: false});
			}
		}

		res.json({success: false});
	} catch (err) {
		next(err);
	}
});

export default router;
