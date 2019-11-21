import {Request, Response, Router, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import randomColor from 'randomcolor';

import User from '../models/User';
import UserSession from '../models/UserSession';
import Article from '../models/Article';
import Comment from '../models/Comment';
import Message from '../models/Message';
import {registerValidators} from '../utils/validators';
import {hash, compare} from '../utils/auth';

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

			const emailValidate = await User.findOne({email: req.body.email, isRemoved: false});
			if (emailValidate) {
				return res.json({errors: [{msg: 'This email is already registered'}]});
			}

			const usernameValidate = await User.findOne({username: req.body.username, isRemoved: false});
			if (usernameValidate) {
				return res.json({errors: [{msg: 'Username not available'}]});
			}

			const user = await User.create({
				username: req.body.username,
				email: req.body.email,
				password: await hash(req.body.password),
				avatar: randomColor({luminosity: 'dark', format: 'rgb'}),
			});

			const session = await UserSession.create({userId: user._id});

			res.json({user, token: session._id});
		} catch (err) {
			next(err);
		}
	},
);

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({username: req.body.username, isRemoved: false});

		if (user) {
			const password = await compare(req.body.password, user.password);
			if (password) {
				const session = await UserSession.create({userId: user._id});

				return res.json({user, token: session._id});
			}

			return res.json({errors: [{msg: 'Passwords do not match'}]});
		}

		res.json({errors: [{msg: 'User not found'}]});
	} catch (err) {
		next(err);
	}
});

router.get('/verify/:token', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const session = await UserSession.findOne({_id: req.params.token, isRemoved: false});

		if (session) {
			const user = await User.findById(session.userId);
			return res.json({user, success: true});
		}

		res.json({success: false});
	} catch (err) {
		next(err);
	}
});

router.get('/logout/:token', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserSession.updateMany(
			{_id: req.params.token, isRemoved: false},
			{$set: {isRemoved: true}},
		);

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

router.delete('/:userId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOneAndUpdate(
			{_id: req.params.userId},
			{$set: {isRemoved: true}},
			{new: true},
		);

		if (user) {
			await UserSession.deleteMany({userId: user._id});
			await Article.deleteMany({user: user._id});
			await Comment.deleteMany({user: user._id});
			await Message.deleteMany({user: user._id});

			res.json({user});
		}
	} catch (err) {
		next(err);
	}
});

export default router;
