import {Socket} from 'socket.io';

import Message, {IMessage} from '../../models/Message';
import {getLogger} from '../logger';
import {removeImage} from '../../utils/images';

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

		this._socket.emit('user_error', {messages: 'Error. Try reload page'});
	}

	async getMessages(): Promise<IMessage[]> {
		const messages = await Message.find({chatId: null})
			.populate('user')
			.sort('-created')
			.limit(20);

		return messages.reverse();
	}

	async loadMore(skip = 0): Promise<{messages: IMessage[]; end: boolean}> {
		const limit = 20;

		const messages = await Message.find({chatId: null})
			.populate('user')
			.sort('-created')
			.skip(skip)
			.limit(limit);

		const end = messages.length < limit;

		return {
			messages: messages.reverse(),
			end,
		};
	}

	async newMessage(message: IMessage): Promise<IMessage | null> {
		const newMessage = await Message.create(message);

		return Message.findById(newMessage._id).populate('user');
	}

	async removeMessage(messageId: string): Promise<void> {
		const message = await Message.findByIdAndRemove(messageId);

		if (message && message.image.url) {
			removeImage(message.image.url);
		}
	}
}

export default Main;
