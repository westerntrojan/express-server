import formidable from 'formidable';

import {uploadImage, removeImage} from '../utils/images';
import {Article, User, Comment, Message} from '../models';
import {IUser} from '../models/User';
import {getUserByLink} from '../utils/users';

interface IUserByLink extends IUser {
	statistics: {
		articles: number;
		comments: number;
		messages: number;
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

		const [articles, comments, messages] = await Promise.all([
			Article.find({user: user._id}).countDocuments(),
			Comment.find({user: user._id}).countDocuments(),
			Message.find({user: user._id}).countDocuments(),
		]);

		const statistics = {articles, comments, messages};

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

	async deleteUser({userId}: {userId: string}): Promise<void> {
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
		fields,
		files,
	}: {
		fields: formidable.Fields;
		files: formidable.Files;
	}): Promise<{success: true; image: string} | {success: false; message: string}> {
		const user = await User.findById(fields.userId);

		if (!user) {
			return {success: false, message: 'User not found'};
		}

		const uploadResult = await uploadImage(files.image);

		if (!uploadResult.success) {
			return {success: false, message: uploadResult.message};
		}

		user.avatar.images.unshift(uploadResult.public_id);
		await user.save();

		return {success: true, image: uploadResult.public_id};
	}

	async deleteAvatar({
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

	async subscribe({
		userId1,
		userId2,
	}: {
		userId1: string;
		userId2: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		await User.updateOne({_id: userId1}, {$push: {subscriptions: userId2}});

		return {success: true};
	}

	async unsubscribe({
		userId1,
		userId2,
	}: {
		userId1: string;
		userId2: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		await User.updateOne({_id: userId1}, {$pullAll: {subscriptions: [userId2]}});

		return {success: true};
	}
}

export default new UsersService();
