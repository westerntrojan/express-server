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
	private readonly _socket: Socket;

	constructor(socket: Socket) {
		this._socket = socket;
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

	error(err: Error): void {
		logger.error(`socket.id: ${this._socket.id}`);
		logger.error(err);

		this._socket.emit('user_error');
	}

	async getMessages({chatId}: {chatId: string}): Promise<IMessage[]> {
		const messages = await Message.find({chatId})
			.populate('user')
			.sort({created: -1})
			.limit(20);

		return messages.reverse();
	}

	async newMessage(message: IMessage): Promise<IMessage> {
		const newMessage = await Message.create(message);

		return newMessage.populate('user').execPopulate();
	}

	async removeMessage(messageId: string): Promise<void> {
		await Message.deleteOne({_id: messageId});
	}
}

export default DirectChat;
