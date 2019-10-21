import Message, {MessageInterface} from '../models/Message';

import getLogger from './logger';

const logger = getLogger(module);

export default class Chat {
	constructor(private client: any) {}

	error = (err: Error): void => {
		logger.error(`client.id: ${this.client.id}`);
		logger.error(err);

		this.client.emit('user_error', {error: {msg: 'Error. Try reload page'}});
	};

	getMessages = async (limit = 10): Promise<MessageInterface[]> => {
		return await Message.find()
			.populate('user')
			.limit(limit)
			.sort({created: -1});
	};

	newMessage = async (message: MessageInterface): Promise<MessageInterface | null> => {
		const newMessage = await Message.create(message);
		return await Message.findById(newMessage._id).populate('user');
	};

	removeMessage = async (messageId: string): Promise<void> => {
		await Message.findByIdAndRemove(messageId);
	};
}
