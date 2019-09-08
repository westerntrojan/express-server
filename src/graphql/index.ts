import {ApolloServer, PubSub} from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import {createComplexityLimitRule} from 'graphql-validation-complexity';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

const pubsub = new PubSub();

export default new ApolloServer({
	typeDefs,
	resolvers,
	context: ({req, connection}: any) => ({pubsub}),
	validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
});
