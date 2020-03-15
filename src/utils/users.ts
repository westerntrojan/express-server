import Article from '../models/Article';
import Comment from '../models/Comment';
import Message from '../models/Message';
import User, {IUser} from '../models/User';
import {getLogger} from '../utils/logger';

const logger = getLogger(module);

type UserStatistics = {
	articles: number;
	comments: number;
	messages: number;
};

export const getUserStatistics = async (userId: string): Promise<UserStatistics> => {
	try {
		const [articles, comments, messages] = await Promise.all([
			Article.find({user: userId}).countDocuments(),
			Comment.find({user: userId}).countDocuments(),
			Message.find({user: userId}).countDocuments()
		]);

		return {articles, comments, messages};
	} catch (err) {
		logger.error(err);

		throw new Error(err);
	}
};

export const getUserByLink = async (userLink: string): Promise<IUser | null> => {
	let user = await User.findOne({username: userLink});

	if (!user) {
		try {
			user = await User.findOne({_id: userLink});
		} catch (err) {
			return null;
		}
	}

	return user;
};

type Avatar = {
	images: string[];
	color: string;
};

export const getAvatar = async (userId: string): Promise<Avatar | undefined> => {
	const user = await User.findById(userId);

	if (user) {
		return {...user.avatar, images: user.avatar.images.reverse()};
	}
};
