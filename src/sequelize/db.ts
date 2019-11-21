import {Sequelize} from 'sequelize';
import {Logger} from 'winston';

import getLogger from '../utils/logger';

const logger = getLogger(module);

const sequelize = new Sequelize('delo', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	logging: (msg: string): Logger => logger.debug(msg),
});

sequelize
	.authenticate()
	.then(() => logger.info('MySQL'))
	.catch((err: Error) => logger.error(err.message));

export default sequelize;
