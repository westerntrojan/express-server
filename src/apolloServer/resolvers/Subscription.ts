import {IPubSub} from './types';

export default {
	viewAdded: {
		subscribe: (_: object, __: object, context: {pubsub: IPubSub}) => {
			return context.pubsub.asyncIterator('view-added');
		},
	},
	likeAdded: {
		subscribe: (_: object, __: object, context: {pubsub: IPubSub}) => {
			return context.pubsub.asyncIterator('like-added');
		},
	},
	dislikeAdded: {
		subscribe: (_: object, __: object, context: {pubsub: IPubSub}) => {
			return context.pubsub.asyncIterator('dislike-added');
		},
	},
};
