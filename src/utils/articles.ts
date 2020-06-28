import Article, {IArticle} from '../models/Article';
import Comment from '../models/Comment';
import User from '../models/User';

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
