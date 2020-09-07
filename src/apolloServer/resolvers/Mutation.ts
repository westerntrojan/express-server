import {IPubSub} from './types';
import Article from '../../models/Article';

export default {
	addLike: async (_: object, args: {id: string}, context: {pubsub: IPubSub}) => {
		const article = await Article.findByIdAndUpdate(args.id, {$inc: {likes: 1}}, {new: true});

		context.pubsub.publish('likes-added', {likesAdded: article});

		return true;
	},
	addDislike: async (_: object, args: {id: string}, context: {pubsub: IPubSub}) => {
		const article = await Article.findByIdAndUpdate(args.id, {$inc: {dislikes: 1}}, {new: true});

		context.pubsub.publish('dislikes-added', {dislikesAdded: article});

		return true;
	},
	addView: async (_: object, args: {id: string}, context: {pubsub: IPubSub}) => {
		const article = await Article.findByIdAndUpdate(args.id, {$inc: {views: 1}}, {new: true});

		context.pubsub.publish('views-added', {viewsAdded: article});

		return true;
	},
};
