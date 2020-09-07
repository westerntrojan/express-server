import {IPubSub} from './types';

export default {
	likesAdded: {
		subscribe: (_: object, args: {id: string}, context: {pubsub: IPubSub}) => {
			return context.pubsub.asyncIterator('likes-added');
		},
	},
	dislikesAdded: {
		subscribe: (_: object, args: {id: string}, context: {pubsub: IPubSub}) => {
			return context.pubsub.asyncIterator('dislikes-added');
		},
	},
	viewsAdded: {
		subscribe: (_: object, args: {id: string}, context: {pubsub: IPubSub}) => {
			return context.pubsub.asyncIterator('views-added');
		},
	},
};
