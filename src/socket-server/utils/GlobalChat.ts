import {Socket} from 'socket.io';
import cloudinary from 'cloudinary';

import Message, {IMessage} from '../../models/Message';
import {getLogger} from '../../utils/logger';

const logger = getLogger(module);

interface IGlobalChat {
	error: (err: Error) => void;
	getMessages: (limit: number) => Promise<IMessage[]>;
	newMessage: (message: IMessage) => Promise<IMessage>;
	preloadMessage: (message: IMessage) => Promise<IMessage>;
	messageLoaded: (message: IMessage) => Promise<{forMe: IMessage; forOther: IMessage} | null>;
	cancelLoadingMessage: (message: IMessage) => Promise<string>;
	updateMessage: (message: IMessage) => Promise<IMessage | null>;
	readMessage: (messageId: string) => Promise<void>;
	removeMessage: (messageId: string) => Promise<void>;
}

class GlobalChat implements IGlobalChat {
	private _socket: Socket;

	constructor(socket: Socket) {
		this._socket = socket;
	}

	error(err: Error): void {
		logger.error(`socket.id: ${this._socket.id}`);
		logger.error(err);

		this._socket.emit('user_error');
	}

	async getMessages(): Promise<IMessage[]> {
		const messages = await Message.find({chatId: null})
			.populate('user')
			.sort({created: -1})
			.limit(20);

		return messages.reverse();
	}

	async newMessage(message: IMessage): Promise<IMessage> {
		const newMessage = await Message.create(message);

		return newMessage.populate('user').execPopulate();
	}

	async preloadMessage(message: IMessage): Promise<IMessage> {
		const newMessage = await Message.create(message);

		return newMessage.populate('user').execPopulate();
	}

	async messageLoaded({
		loadingId,
		user,
		audio,
	}: IMessage): Promise<{forMe: IMessage; forOther: IMessage} | null> {
		const [forMe, forOther] = await Promise.all([
			Message.findOne({loadingId, user, audio: ''}),
			Message.findOneAndUpdate(
				{loadingId, user, audio: ''},
				{$set: {audio, created: Date.now().toString()}},
				{new: true},
			).populate('user'),
		]);

		if (!forMe || !forOther) {
			await cloudinary.v2.api.delete_resources([audio], {
				resource_type: 'video',
			});

			return null;
		}

		return {forMe: {...forOther.toObject(), created: forMe.created}, forOther};
	}

	async cancelLoadingMessage({user, loadingId}: IMessage): Promise<string> {
		const removedMessage = await Message.findOneAndRemove({
			loadingId,
			user,
		});

		if (!removedMessage) {
			return '';
		}

		return removedMessage._id;
	}

	async updateMessage(message: IMessage): Promise<IMessage | null> {
		const updatedMessage = await Message.findByIdAndUpdate(
			message._id,
			{$set: {...message}},
			{new: true},
		).populate('user');

		return updatedMessage;
	}

	async readMessage(messageId: string): Promise<void> {
		return Message.updateOne({_id: messageId}, {$set: {isRead: true}});
	}

	async removeMessage(messageId: string): Promise<void> {
		const message = await Message.findById(messageId);

		if (message) {
			if (message.type === 'audio') {
				await cloudinary.v2.api.delete_resources([message.audio], {
					resource_type: 'video',
				});
			}

			await message.remove();
		}
	}
}

export default GlobalChat;
