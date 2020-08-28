import Article from '../models/Article';

interface IPubSub {
	publish: (name: string, options: object) => void;
	asyncIterator: (names: string | [string]) => void;
}

export default {
	Query: {
		allArticles: async () => Article.find(),
		Article: async (_: object, args: {id: string}) => Article.findById(args.id),
		topTags: () => [
			'development',
			'news',
			'events',
			'article',
			'random',
			'text',
			'lorem ipsum',
			'other',
			'asd',
			'some tag',
			'people',
			'beautiful',
			'forest',
		],
		topArticles: async (_: object, args: {limit: number}) => {
			const articles = await Article.find().limit(args.limit);

			return articles;
		},
	},
	Mutation: {
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
	},
	Subscription: {
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
	},
};
