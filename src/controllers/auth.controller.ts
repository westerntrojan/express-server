import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import passport from 'passport';

import AuthService from '../services/auth.service';

class AuthController {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			return passport.authenticate('login', {session: false}, async (err, user, info) => {
				if (err) {
					return next(err);
				}

				if (!user) {
					return res.json({success: false, message: info.message});
				}

				if (user.twoFactorAuth) {
					const result = await AuthService.createCode({user});

					if (!result.success) {
						return res.json({success: false, message: result.message});
					}

					return res.json({success: false, twoFactorAuth: true, userId: user._id});
				}

				return res.json({success: true, user: user.getValidUser(), token: user.generateToken()});
			})(req, res, next);
		} catch (err) {
			next(err);
		}
	}

	async verifyCode(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await AuthService.verifyCode({
				userId: req.body.userId,
				code: req.body.code,
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true, user: result.user, token: result.token});
		} catch (err) {
			next(err);
		}
	}

	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, message: errors.array()[0].msg});
			}

			const result = await AuthService.register({data: req.body});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async registerVerify(req: Request, res: Response, next: NextFunction) {
		try {
			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async passwordReset(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await AuthService.passwordReset({
				userId: String(req.user),
				newPassword: req.body.password,
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async passwordResetSendEmail(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await AuthService.passwordResetSendEmail({email: req.body.email});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async passwordResetVerify(req: Request, res: Response, next: NextFunction) {
		try {
			res.json({success: true, userId: req.user});
		} catch (err) {
			next(err);
		}
	}

	async verify(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.headers.authorization) {
				return res.json({success: false});
			}

			const token = req.headers.authorization.slice(7);

			const result = await AuthService.verify({token});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true, user: result.user});
		} catch (err) {
			next(err);
		}
	}
}

export default new AuthController();
