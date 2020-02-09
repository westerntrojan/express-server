import Category from './models/Category';
import User from './models/User';
import data from './seed.json';

import {getLogger} from './utils/logger';

const logger = getLogger(module);

export const makeSeeding = async (): Promise<void> => {
	await Promise.all([await User.deleteMany({}), await Category.deleteMany({})]);
	await Promise.all([await User.create(data.users), await Category.create(data.categories)]);

	logger.info('Seeding complete');
};
