import Article, {IArticle} from '../models/Article';
import Comment from '../models/Comment';
import User from '../models/User';

export const addToBookmarks = async (articleId: string, userId: string): Promise<boolean> => {
	const user = await User.findById(userId);

	if (user) {
		if (user.bookmarks.includes(articleId)) {
			await Promise.all([
				Article.updateOne({_id: articleId}, {$inc: {bookmarksCount: -1}}),
				User.updateOne({_id: userId}, {$pullAll: {bookmarks: [articleId]}}),
			]);

			return false;
		}

		await Promise.all([
			Article.updateOne({_id: articleId}, {$inc: {bookmarksCount: 1}}),
			User.updateOne({_id: userId}, {$push: {bookmarks: articleId}}),
		]);
	}

	return true;
};

export const removeArticle = async (articleId: string): Promise<IArticle | undefined> => {
	const article = await Article.findByIdAndRemove(articleId);

	if (article) {
		await Promise.all([
			Comment.deleteMany({articleId}),
			User.updateMany({bookmarks: articleId}, {$pullAll: {bookmarks: [articleId]}}),
		]);

		return article;
	}
};
