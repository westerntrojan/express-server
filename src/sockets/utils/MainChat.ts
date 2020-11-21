import {Socket} from 'socket.io';

import Message, {IMessage} from '../../models/Message';
import {getLogger} from '../../utils/logger';

const logger = getLogger(module);

interface IMainChat {
	getMessages: (limit: number) => Promise<IMessage[]>;
	newMessage: (message: IMessage) => Promise<IMessage | null>;
	removeMessage: (_id: string) => Promise<void>;
}

class MainChat implements IMainChat {
	private _socket: Socket;

	constructor(socket: Socket) {
		this._socket = socket;
	}

	public error(err: Error): void {
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

	async removeMessage(_id: string): Promise<void> {
		await Message.deleteOne({_id});
	}
}

export default MainChat;
