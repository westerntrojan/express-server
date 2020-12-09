import argon2 from 'argon2';

import {Article, AuthCode, Comment, Category, User, Message, Chat} from '../models';
import {ICategory} from '../models/Category';
import data from '../seed.json';

class AppService {
	async resetApp(): Promise<{categories: ICategory[]}> {
		await Promise.all([
			Article.deleteMany({}),
			AuthCode.deleteMany({}),
			Category.deleteMany({}),
			Comment.deleteMany({}),
			Message.deleteMany({}),
			User.deleteMany({}),
			Chat.deleteMany({}),
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

		return {categories};
	}
}

export default new AppService();
