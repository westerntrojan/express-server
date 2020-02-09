import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import User from '@models/User';
import UserSession from '@models/UserSession';
import {registerValidators} from '@utils/validators';
import {compare} from '@utils/auth';

const router = Router();

router.post(
	'/register',
	registerValidators,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({errors: errors.array()});
			}

			const emailValidate = await User.findOne({email: req.body.email});
			if (emailValidate) {
				return res.json({errors: [{msg: 'This email is already registered'}]});
			}

			const user = await User.create(req.body);

			const session = await UserSession.create({userId: user._id});

			res.json({user, token: session._id});
		} catch (err) {
			next(err);
		}
	}
);

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = await User.findOne({email: req.body.link, isRemoved: false});

		if (!user) {
			user = await User.findOne({username: req.body.link, isRemoved: false});
		}

		if (user) {
			const password = await compare(req.body.password, user.password);
			if (password) {
				const session = await UserSession.create({userId: user._id});

				return res.json({user, token: session._id});
			}

			return res.json({errors: [{msg: 'User not found'}]});
		}

		res.json({errors: [{msg: 'User not found'}]});
	} catch (err) {
		next(err);
	}
});

router.get('/logout/:token', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserSession.deleteOne({_id: req.params.token});

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

router.get('/verify/:token', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const session = await UserSession.findOne({_id: req.params.token});

		if (session) {
			const user = await User.findById(session.userId);
			if (user) {
				return res.json({user, success: true});
			}
		}

		res.json({success: false});
	} catch (err) {
		next(err);
	}
});

export default router;
