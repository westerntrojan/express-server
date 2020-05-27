import {Socket} from 'socket.io';

import Message, {IMessage} from '../../models/Message';
import {getLogger} from '../logger';

const logger = getLogger(module);

interface IMain {
	error: (err: Error) => void;
	getMessages: (limit: number) => Promise<IMessage[]>;
	newMessage: (message: IMessage) => Promise<IMessage | null>;
	removeMessage: (messageId: string) => Promise<void>;
}

class Main implements IMain {
	constructor(private readonly _socket: Socket) {}

	error(err: Error): void {
		logger.error(`socket.id: ${this._socket.id}`);
		logger.error(err);

		this._socket.emit('user_error', {error: {msg: 'Error. Try reload page'}});
	}

	async getMessages(limit = 10): Promise<IMessage[]> {
		const messages = await Message.find({chatId: null})
			.populate('user')
			.sort('created')
			.limit(limit);

		return messages;
	}

	async newMessage(message: IMessage): Promise<IMessage | null> {
		const newMessage = await Message.create(message);

		return Message.findById(newMessage._id).populate('user');
	}

	async removeMessage(messageId: string): Promise<void> {
		await Message.deleteOne({_id: messageId});
	}
}

export default Main;
