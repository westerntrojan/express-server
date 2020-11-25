import {ApolloServer, PubSub} from 'apollo-server-express';
import fs from 'fs';
import path from 'path';

import {Context} from './types';
import resolvers from './resolvers';
import {verifyToken} from '../utils/auth';

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf-8');

const pubsub = new PubSub();

export const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({req, connection}): Promise<Context> => {
		if (!connection) {
			const token = req.headers.authorization ? req.headers.authorization.slice(7) : '';

			const user = await verifyToken(token);

			if (!user) {
				return {
					pubsub,
					isAuth: false,
				};
			}
		}

		return {
			pubsub,
			isAuth: true,
		};
	},
	playground: {
		settings: {
			'editor.theme': 'dark',
		},
	},
});
