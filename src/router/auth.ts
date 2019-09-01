import {Request, Response, Router} from 'express';
const {validationResult} = require('express-validator');

const User = require('../models/User');
const UserSession = require('../models/UserSession');
const {registerValidators, loginValidators} = require('../utils/validators');
const {hash, compare} = require('../utils/auth');

const router = Router();

router.post('/register', registerValidators, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const emailValidate = await User.findOne({email: req.body.email});
	if (emailValidate) {
		return res.json({errors: [{msg: 'This email is already registered'}]});
	}

	const usernameValidate = await User.findOne({username: req.body.username});
	if (usernameValidate) {
		return res.json({errors: [{msg: 'Username not available'}]});
	}

	const user = await User.create({
		username: req.body.username,
		email: req.body.email,
		password: await hash(req.body.password),
	});

	const session = await UserSession.create({userId: user._id});

	res.json({user, token: session._id});
});

router.post('/login', loginValidators, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

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
});

router.get('/verify/:token', async (req: Request, res: Response) => {
	try {
		const session = await UserSession.findOne({_id: req.params.token, isRemoved: false});

		if (session) {
			const user = await User.findById(session.userId);
			return res.json({user, success: true});
		}

		res.json({success: false});
	} catch (e) {
		res.json({success: false});
	}
});

router.get('/logout/:token', async (req: Request, res: Response) => {
	try {
		await UserSession.update(
			{_id: req.params.token, isRemoved: false},
			{$set: {isRemoved: true}},
			{new: true}
		);

		res.json({success: true});
	} catch (e) {
		res.json({success: false});
	}
});

module.exports = router;
