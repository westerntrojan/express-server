import Article from '../models/Article';
import Comment from '../models/Comment';
import Message from '../models/Message';
import User, {IUser} from '../models/User';

type UserStatistics = {
	articles: number;
	comments: number;
	messages: number;
};

export const getUserStatistics = async (userId: string): Promise<UserStatistics> => {
	const [articles, comments, messages] = await Promise.all([
		Article.find({user: userId}).countDocuments(),
		Comment.find({user: userId}).countDocuments(),
		Message.find({user: userId}).countDocuments(),
	]);

	return {articles, comments, messages};
};

export const getUserByLink = async (
	userLink: string,
	condition?: object,
): Promise<IUser | null> => {
	try {
		const [byEmail, byUsername] = await Promise.all([
			User.findOne({email: userLink, ...condition}),
			User.findOne({username: userLink, ...condition}),
		]);

		if (byEmail) {
			return byEmail;
		}

		if (byUsername) {
			return byUsername;
		}

		const byId = await User.findById(userLink, condition);

		return byId;
	} catch {
		return null;
	}
};
