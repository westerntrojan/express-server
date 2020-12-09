import {Chat, Message} from '../models';
import {IChat} from '../models/Chat';
import {IUser} from '../models/User';
import {IMessage} from '../models/Message';

interface IReturningChat extends IChat {
	user: IUser;
	lastMessage: IMessage;
}

class ChatsService {
	async getChatId({user1, user2}: {user1: string; user2: string}): Promise<string> {
		let chat = await Chat.findOne({
			$or: [
				{user1, user2},
				{user2: user1, user1: user2},
			],
		});

		if (!chat) {
			chat = await Chat.create({user1, user2});
		}

		return chat._id;
	}

	async getUserChats({userId}: {userId: string}): Promise<IReturningChat[]> {
		const userChats = await Chat.find({
			$or: [{user1: userId}, {user2: userId}],
		});

		const chats = await Promise.all(
			userChats.map(async chat => {
				const lastMessage = await Message.findOne({chatId: chat._id}).sort({created: -1});

				if (userId === String(chat.user1)) {
					const {user2: user} = await chat.populate('user2').execPopulate();

					return {...chat.toObject(), user, lastMessage};
				}

				const {user1: user} = await chat.populate('user1').execPopulate();

				return {...chat.toObject(), user, lastMessage};
			}),
		);

		return chats;
	}

	async removeChat({chatId}: {chatId: string}): Promise<void> {
		await Promise.all([Chat.deleteOne({_id: chatId}), Message.deleteMany({chatId})]);
	}
}

export default new ChatsService();
