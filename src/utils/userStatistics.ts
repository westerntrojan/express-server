import Article from '../models/Article';
import Comment from '../models/Comment';
import Message from '../models/Message';

interface StatisticsInterface {
	articles: number;
	comments: number;
	messages: number;
}

export default async (userId: string): Promise<StatisticsInterface> => {
	try {
		const articles = await Article.find({user: userId}).countDocuments();
		const comments = await Comment.find({user: userId}).countDocuments();
		const messages = await Message.find({user: userId}).countDocuments();

		return {articles, comments, messages};
	} catch (err) {
		throw new Error(err);
	}
};
