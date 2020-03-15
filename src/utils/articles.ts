import Article, {IArticle} from '../models/Article';
import Comment from '../models/Comment';
import User from '../models/User';

export const addLike = async (articleId: string, userId: string): Promise<boolean> => {
	const user = await User.findById(userId);

	if (user) {
		if (user.likedArticles.includes(articleId)) {
			await Promise.all([
				Article.updateOne({_id: articleId}, {$inc: {likes: -1}}),
				User.updateOne({_id: userId}, {$pullAll: {likedArticles: [articleId]}})
			]);

			return false;
		} else {
			await Promise.all([
				Article.updateOne({_id: articleId}, {$inc: {likes: 1}}),
				User.updateOne({_id: userId}, {$push: {likedArticles: articleId}})
			]);
		}
	}

	return true;
};

export const removeArticle = async (articleId: string): Promise<IArticle | undefined> => {
	const article = await Article.findByIdAndRemove(articleId);

	if (article) {
		await Promise.all([
			Comment.deleteMany({articleId}),
			User.updateMany({likedArticles: articleId}, {$pullAll: {likedArticles: [articleId]}})
		]);

		return article;
	}
};
