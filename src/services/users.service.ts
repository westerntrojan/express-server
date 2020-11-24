import {removeImage} from '../utils/images';
import {Article, User} from '../models';
import {IUser} from '../models/User';
import {IArticle} from '../models/Article';
import {getUserByLink} from '../utils/users';

interface IUserByLink extends IUser {
	statistics: {
		articles: number;
		followers: number;
		following: number;
	};
}

class UsersService {
	async getUserByLink({
		userLink,
	}: {
		userLink: string;
	}): Promise<{success: true; user: IUserByLink} | {success: false; message: string}> {
		const user = await getUserByLink(userLink);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		const [articles, followers] = await Promise.all([
			Article.find({user: user._id}).countDocuments(),
			User.find({following: user._id}).countDocuments(),
		]);
		const following = user.following.length;

		const statistics = {articles, followers, following};

		return {success: true, user: {...user.toObject(), statistics}};
	}

	async updateUser({
		userId,
		data,
	}: {
		userId: string;
		data: IUser;
	}): Promise<{success: true; user: IUser} | {success: false; message: string}> {
		if (data.username) {
			const usernameVerification = await User.findOne({username: data.username});

			if (usernameVerification && String(usernameVerification._id) !== userId) {
				return {success: false, message: 'Username not available'};
			}
		}

		const updatedUser = await User.findByIdAndUpdate(userId, {$set: {...data}}, {new: true});

		if (!updatedUser) {
			return {success: false, message: 'User not found'};
		}

		return {success: true, user: updatedUser};
	}

	async removeUser({userId}: {userId: string}): Promise<void> {
		await User.updateOne({_id: userId}, {$set: {isRemoved: true}});
	}

	async setTwoFactorAuth({
		userId,
	}: {
		userId: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const user = await User.findById(userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		user.twoFactorAuth = !user.twoFactorAuth;
		await user.save();

		return {success: true};
	}

	async addAvatar({
		userId,
		newAvatar,
	}: {
		userId: string;
		newAvatar: string;
	}): Promise<{success: true; newAvatar: string} | {success: false; message: string}> {
		const user = await User.findById(userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		user.avatar.images.unshift(newAvatar);
		await user.save();

		return {success: true, newAvatar};
	}

	async removeAvatar({
		userId,
		image,
	}: {
		userId: string;
		image: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const user = await User.findById(userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		await Promise.all([
			User.updateOne({_id: userId}, {$pullAll: {'avatar.images': [image]}}),
			removeImage(image),
		]);

		return {success: true};
	}

	async follow({
		userId1,
		userId2,
	}: {
		userId1: string;
		userId2: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		await User.updateOne({_id: userId1}, {$push: {following: userId2}});

		return {success: true};
	}

	async unfollow({
		userId1,
		userId2,
	}: {
		userId1: string;
		userId2: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		await User.updateOne({_id: userId1}, {$pullAll: {following: [userId2]}});

		return {success: true};
	}

	async addToBookmarks({
		userId,
		articleId,
	}: {
		userId: string;
		articleId: string;
	}): Promise<{success: true; action: 'removed' | 'added'} | {success: false; message: string}> {
		const user = await User.findById(userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		if (user.bookmarks.includes(articleId)) {
			await User.updateOne({_id: userId}, {$pullAll: {bookmarks: [articleId]}});

			return {success: true, action: 'removed'};
		}

		await User.updateOne({_id: userId}, {$push: {bookmarks: articleId}});

		return {success: true, action: 'added'};
	}

	async getBookmarks({
		userId,
	}: {
		userId: string;
	}): Promise<{success: true; articles: IArticle[]} | {success: false; message: string}> {
		const user = await User.findById(userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		const articles: IArticle[] = [];

		await Promise.all(
			user.bookmarks.map(async (articleId: string) => {
				const article = await Article.findById(articleId).populate('user comments');

				if (article) {
					articles.push(article);
				}
			}),
		);

		return {success: true, articles};
	}
}

export default new UsersService();
