import {Article, User} from '../../models';
import {Context} from '../types';

export default {
	addView: async (_: object, args: {id: string}, context: Context) => {
		const article = await Article.findByIdAndUpdate(args.id, {$inc: {views: 1}}, {new: true});

		context.pubsub.publish('view-added', {viewAdded: article});

		return true;
	},
	addLike: async (_: object, args: {id: string}, context: Context) => {
		if (!context.isAuth) {
			return false;
		}

		const article = await Article.findByIdAndUpdate(args.id, {$inc: {likes: 1}}, {new: true});

		context.pubsub.publish('like-added', {likeAdded: article});

		return true;
	},
	addDislike: async (_: object, args: {id: string}, context: Context) => {
		if (!context.isAuth) {
			return false;
		}

		const article = await Article.findByIdAndUpdate(args.id, {$inc: {dislikes: 1}}, {new: true});

		context.pubsub.publish('dislike-added', {dislikeAdded: article});

		return true;
	},
	addToBookmarks: async (
		_: object,
		args: {userId: string; articleId: string},
		context: Context,
	) => {
		if (!context.isAuth) {
			return false;
		}

		const user = await User.findById(args.userId);

		if (!user) {
			throw new Error('User not found');
		}

		if (user.bookmarks.includes(args.articleId)) {
			await User.updateOne({_id: args.userId}, {$pullAll: {bookmarks: [args.articleId]}});

			return false;
		}

		await User.updateOne({_id: args.userId}, {$push: {bookmarks: args.articleId}});

		return true;
	},
};
