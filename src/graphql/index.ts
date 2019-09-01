const {ApolloServer, PubSub} = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const {createComplexityLimitRule} = require('graphql-validation-complexity');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const pubsub = new PubSub();

module.exports = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({req}: any) => ({req, pubsub}),
	validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
});
