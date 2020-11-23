import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import {getNotFoundError} from '../utils/errors';
import UsersService from '../services/users.service';

class UsersController {
	async getUserByLink(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await UsersService.getUserByLink({userLink: req.params.userLink});

			if (!result.success) {
				const notFoundError = getNotFoundError();

				return res.status(404).json(notFoundError);
			}

			return res.json({success: true, user: result.user});
		} catch (err) {
			next(err);
		}
	}

	async updateUser(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.json({success: false, messages: errors.array()[0].msg});
			}

			const result = await UsersService.updateUser({userId: req.params.userId, data: req.body});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true, user: result.user});
		} catch (err) {
			next(err);
		}
	}

	async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			await UsersService.deleteUser({userId: req.params.userId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async setTwoFactorAuth(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await UsersService.setTwoFactorAuth({userId: req.params.userId});

			if (!result.success) {
				return res.json({success: false, message: 'User not found'});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async addAvatar(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await UsersService.addAvatar(req.body);

			if (!result.success) {
				return res.json({scucess: false, message: result.message});
			}

			res.json({success: true, newAvatar: result.newAvatar});
		} catch (err) {
			next(err);
		}
	}

	async deleteAvatar(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await UsersService.deleteAvatar({
				userId: req.body.userId,
				image: req.body.image,
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async follow(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await UsersService.follow({
				userId1: req.body.userId1,
				userId2: req.body.userId2,
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async unfollow(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await UsersService.unfollow({
				userId1: req.body.userId1,
				userId2: req.body.userId2,
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}
}

export default new UsersController();
