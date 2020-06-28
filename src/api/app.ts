import {Router, Request, Response, NextFunction} from 'express';
import argon2 from 'argon2';
import passport from 'passport';
import cloudinary from 'cloudinary';

import data from '../seed.json';

import {Article, AuthCode, Comment, Category, User, Message, UserChat} from '../models';

const router = Router();

router.get(
	'/reset',
	passport.authenticate('isAdmin', {session: false}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await Promise.all([
				Article.deleteMany({}),
				AuthCode.deleteMany({}),
				Category.deleteMany({}),
				Comment.deleteMany({}),
				Message.deleteMany({}),
				User.deleteMany({}),
				UserChat.deleteMany({}),
				cloudinary.v2.api.delete_all_resources(),
			]);

			const users = await Promise.all(
				data.users.map(async user => {
					return {
						...user,
						password: await argon2.hash(user.password),
					};
				}),
			);

			const [, categories] = await Promise.all([
				User.create(users),
				Category.create(data.categories),
			]);

			res.json({success: true, categories});
		} catch (err) {
			next(err);
		}
	},
);

export default router;
