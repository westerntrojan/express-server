import Article from './models/Article';
import Comment from './models/Comment';
import Category from './models/Category';
import User from './models/User';
import Message from './models/Message';
import UserChat from './models/UserChat';
import UserSession from './models/UserSession';
import data from './seed.json';

import {getLogger} from './utils/logger';

const logger = getLogger(module);

export const makeSeeding = async (): Promise<void> => {
	await Promise.all([
		Article.deleteMany({}),
		Comment.deleteMany({}),
		Category.deleteMany({}),
		User.deleteMany({}),
		Message.deleteMany({}),
		UserChat.deleteMany({}),
		UserSession.deleteMany({}),
	]);
	await Promise.all([User.create(data.users), Category.create(data.categories)]);

	logger.info('Seeding complete');
};
