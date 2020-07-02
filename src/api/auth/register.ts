import {Router, Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import passport from 'passport';
import randomColor from 'randomcolor';

import User from '../../models/User';
import {registerValidators} from '../../utils/validators';
import {sendEmail} from '../../utils/email';

const router = Router();

router.post('/', registerValidators, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({success: false, message: errors.array()[0].msg});
		}

		const user = await User.findOne({email: req.body.email, isRemoved: false});

		if (user) {
			return res.json({success: false, message: 'User exists'});
		}

		const newUser = new User(req.body);
		newUser.password = await newUser.hashPassword(req.body.password);
		newUser.avatar.color = randomColor({luminosity: 'dark', format: 'rgb'});
		await newUser.save();

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

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

router.get(
	'/verify',
	passport.authenticate('registerVerify', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({success: true});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
