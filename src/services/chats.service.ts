import formidable from 'formidable';

import {User, UserChat, Message} from '../models';
import {IUserChat} from '../models/UserChat';
import {IUser} from '../models/User';
import {IMessage} from '../models/Message';
import {uploadImage} from '../utils/images';

interface IReturningChat extends IUserChat {
	user: IUser;
	lastMessage: IMessage;
}

class ChatsService {
	async getUserChats({userId}: {userId: string}): Promise<IReturningChat[]> {
		const userChats = await UserChat.find({
			$or: [{from: userId}, {to: userId}],
		});

		const chats = await Promise.all(
			userChats.map(async chat => {
				const lastMessage = await Message.findOne({chatId: chat._id}).sort({created: -1});

				if (userId === String(chat.from)) {
					const user = await User.findById(chat.to);

					return {...chat.toObject(), user, lastMessage};
				}

				const user = await User.findById(chat.from);

				return {...chat.toObject(), user, lastMessage};
			}),
		);

		return chats;
	}

	async deleteChat({chatId}: {chatId: string}): Promise<void> {
		await Promise.all([UserChat.deleteOne({_id: chatId}), Message.deleteMany({chatId})]);
	}

	async deleteChatMessages({chatId}: {chatId: string}): Promise<void> {
		await Message.deleteMany({chatId});
	}

	async addImage({
		files,
	}: {
		files: formidable.Files;
	}): Promise<{success: true; image: string} | {success: false; message: string}> {
		const result = await uploadImage(files.image);

		if (!result.success) {
			return {success: false, message: result.message};
		}

		return {success: true, image: result.public_id};
	}
}

export default new ChatsService();
