import {Socket} from 'socket.io';

import UserChat, {IUserChat} from '../../models/UserChat';
import Message, {IMessage} from '../../models/Message';
import {getLogger} from '../logger';

const logger = getLogger(module);

interface IUsers {
	error: (err: Error) => void;
	findChat: (condition: IUserChat) => Promise<IUserChat | null>;
	getMessages: (chatId: string) => Promise<IMessage[]>;
	newChat: (data: IUserChat) => Promise<IUserChat>;
	newMessage: (message: IMessage) => Promise<IMessage | null>;
	removeMessage: (messageId: string) => Promise<void>;
}

class Users implements IUsers {
	constructor(private readonly _socket: Socket) {}

	error(err: Error): void {
		logger.error(`socket.id: ${this._socket.id}`);
		logger.error(err);

		this._socket.emit('user_error', {error: {msg: 'Error. Try reload page'}});
	}

	async findChat(condition: IUserChat): Promise<IUserChat | null> {
		const {from, to} = condition;

		return UserChat.findOne({
			$or: [
				{from, to},
				{to: from, from: to},
			],
		});
	}

	async getMessages(chatId: string): Promise<IMessage[]> {
		return Message.find({chatId}).populate('user');
	}

	async newChat(data: IUserChat): Promise<IUserChat> {
		return UserChat.create(data);
	}

	async newMessage(data: IMessage): Promise<IMessage | null> {
		const newMessage = await Message.create(data);

		return Message.findById(newMessage._id).populate('user');
	}

	async removeMessage(messageId: string): Promise<void> {
		await Message.deleteOne({_id: messageId});
	}
}

export default Users;
