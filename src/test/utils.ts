import {agent as request} from 'supertest';

import server from '../server';
import User, {IUser} from '../models/User';
import {ICategory} from '../models/Category';

export const login = async (): Promise<{success: boolean; user: IUser; token: string}> => {
	const {body} = await request(server)
		.post('/api/v1/auth/login')
		.send({
			userLink: 'jack@gmail.com',
			password: 'password',
		});

	return body;
};

export const loginAsAdmin = async (): Promise<{success: boolean; user: IUser; token: string}> => {
	const {body} = await request(server)
		.post('/api/v1/auth/login')
		.send({
			userLink: 'norlandy',
			password: 'password',
		});

	return body;
};

const makeAdmin = async (): Promise<void> => {
	const user = await User.findOne({role: 0});

	if (!user) {
		await request(server)
			.post('/api/v1/auth/register')
			.send({
				firstName: 'Edgar',
				username: 'norlandy',
				email: 'norlandy@gmail.com',
				password: 'password',
				role: 0,
			});
	}
};

export const resetApp = async (): Promise<void> => {
	await makeAdmin();

	const {token} = await loginAsAdmin();

	await request(server)
		.get('/api/v1/app/reset')
		.set({Authorization: `Bearer ${token}`});
};

const getCategory = async (slug: string): Promise<ICategory> => {
	const {
		body: {category},
	} = await request(server).get(`/api/v1/categories/${slug}`);

	return category;
};

type TestArticle = {
	title: string;
	text: string;
	tags: string[];
	category: string;
	userId: string;
};

export const getTestArticle = async ({userId}: {userId: string}): Promise<TestArticle> => {
	const category = await getCategory('event');

	return {
		title: 'Some title',
		text: 'Some text',
		tags: ['some tag', 'example', '123'],
		category: category._id,
		userId,
	};
};
