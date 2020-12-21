import {Socket} from 'socket.io';

import Chat from '../../models/Chat';
import Message, {IMessage} from '../../models/Message';
import {getLogger} from '../../utils/logger';
import {verifyToken} from '../../utils/auth';

const logger = getLogger(module);

interface IDirectChat {
	error: (err: Error) => void;
	getMessages: (data: {chatId: string}) => Promise<IMessage[]>;
	newMessage: (message: IMessage) => Promise<IMessage>;
	removeMessage: (messageId: string) => Promise<void>;
}

class DirectChat implements IDirectChat {
	private readonly client: Socket;
	private readonly chatId: string;
	private sentMessages = 0;

	constructor(client: Socket, chatId: string) {
		this.client = client;
		this.chatId = chatId;
	}

	static async loginCheck({
		chatId,
		token,
	}: {
		chatId: string;
		token: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const user = await verifyToken(token);

		if (!user) {
			return {success: false, message: 'Not authenticated'};
		}

		try {
			const chat = await Chat.findOne({
				_id: chatId,
				$or: [{user1: user._id}, {user2: user._id}],
			});

			if (!chat) {
				return {success: false, message: 'Chat not found'};
			}
		} catch {
			return {success: false, message: 'Chat not found'};
		}

		return {success: true};
	}

	error(err: Error) {
		logger.error(`client.id: ${this.client.id}`);
		logger.error(err);

		this.client.emit('user_error');
	}

	async getMessages(): Promise<IMessage[]> {
		const limit = 20;

		const messages = await Message.find({chatId: this.chatId})
			.populate('user')
			.sort({created: -1})
			.skip(this.sentMessages)
			.limit(limit);

		this.sentMessages += messages.length;

		return messages.reverse();
	}

	async newMessage(message: IMessage): Promise<IMessage> {
		const newMessage = await Message.create({...message, chatId: this.chatId});

		return newMessage.populate('user').execPopulate();
	}

	async removeMessage(messageId: string): Promise<void> {
		await Message.deleteOne({_id: messageId});
	}
}

export default DirectChat;
