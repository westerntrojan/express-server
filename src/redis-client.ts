import redis from 'redis';
import {promisify} from 'util';

import {getLogger} from './utils/logger';

const logger = getLogger(module);

declare module 'redis' {
	interface RedisClient {
		getAsync: (key: string) => Promise<string | null>;
	}
}

const client = redis.createClient({
	url: String(process.env.REDIS_URL),
	password: String(process.env.REDIS_PASSWORD) || undefined,
});
client.getAsync = promisify(client.get).bind(client);

client.on('error', error => {
	logger.error(error);
});

export default client;
