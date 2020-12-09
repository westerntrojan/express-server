import {Context} from '../types';

export default {
	viewAdded: {
		subscribe: (_: object, __: object, context: Context) => {
			return context.pubsub.asyncIterator('view-added');
		},
	},
	likeAdded: {
		subscribe: (_: object, __: object, context: Context) => {
			return context.pubsub.asyncIterator('like-added');
		},
	},
	dislikeAdded: {
		subscribe: (_: object, __: object, context: Context) => {
			return context.pubsub.asyncIterator('dislike-added');
		},
	},
};
