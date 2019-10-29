import {Socket} from 'socket.io';

import UserChat, {UserChatInterface} from '../../models/UserChat';
import Message, {MessageInterface} from '../../models/Message';

import getLogger from '../logger';

const logger = getLogger(module);

export default class {
	constructor(private socket: Socket) {}

	error = (err: Error): void => {
		logger.error(`socket.id: ${this.socket.id}`);
		logger.error(err);

		this.socket.emit('user_error', {error: {msg: 'Error. Try reload page'}});
	};

	findChat = async ({from, to}: {from: string; to: string}): Promise<UserChatInterface | null> => {
		return await UserChat.findOne({$or: [{from, to}, {to: from, from: to}]});
	};

	getMessages = async (chatId: string): Promise<MessageInterface[]> => {
		return await Message.find({chatId}).populate('user');
	};

	newChat = async (data: {from: string; to: string}): Promise<UserChatInterface | null> => {
		return await UserChat.create(data);
	};

	newMessage = async (message: MessageInterface): Promise<MessageInterface | null> => {
		const newMessage = await Message.create({
			chatId: message.chatId,
			user: message.user,
			text: message.text,
		});
		return await Message.findById(newMessage._id).populate('user');
	};

	removeMessage = async (messageId: string): Promise<void> => {
		await Message.findByIdAndRemove(messageId);
	};
}
