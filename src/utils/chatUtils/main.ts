import {Socket} from 'socket.io';

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

	getMessages = async (limit = 10): Promise<MessageInterface[]> => {
		return await Message.find({chatId: 'main'})
			.populate('user')
			.sort({created: -1})
			.limit(limit);
	};

	newMessage = async (message: MessageInterface): Promise<MessageInterface | null> => {
		const newMessage = await Message.create(message);
		return await Message.findById(newMessage._id).populate('user');
	};

	removeMessage = async (messageId: string): Promise<void> => {
		await Message.findByIdAndRemove(messageId);
	};
}
