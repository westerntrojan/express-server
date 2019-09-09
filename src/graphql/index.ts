import {ApolloServer, MockList, PubSub} from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import {createComplexityLimitRule} from 'graphql-validation-complexity';

import typeDefs from './typeDefs.graphql';
import resolvers from './resolvers';

const pubsub = new PubSub();

const mocks = {
	Query: () => ({
		totalArticles: () => 42,
		articles: () => new MockList([5, 10]),
		Article: () => ({
			user: {
				username: 'normandy',
			},
		}),
	}),
};

export default new ApolloServer({
	typeDefs,
	resolvers,
	engine: true,
	context: ({req, connection}: any) => ({pubsub}),
	validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
});
