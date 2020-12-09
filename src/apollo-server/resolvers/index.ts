import {GraphQLEmail, GraphQLDateTime} from 'graphql-custom-types';

import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';

export default {
	Email: GraphQLEmail,
	DateTime: GraphQLDateTime,
	Query,
	Mutation,
	Subscription,
};
