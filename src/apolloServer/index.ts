import {ApolloServer, PubSub} from 'apollo-server-express';
import fs from 'fs';
import path from 'path';

import resolvers from './resolvers';

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf-8');

const pubsub = new PubSub();

type Context = {
	pubsub: PubSub;
};

export const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: (): Context => ({
		pubsub,
	}),
});
