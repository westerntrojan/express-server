import {Socket} from 'socket.io';

import Group from '../../models/Group';
import Message, {IMessage} from '../../models/Message';
import {getLogger} from '../../utils/logger';
import {verifyToken} from '../../utils/auth';

const logger = getLogger(module);

interface IGroupChat {
	error: (err: Error) => void;
	getMessages: (data: {groupId: string}) => Promise<IMessage[]>;
	newMessage: (message: IMessage) => Promise<IMessage>;
	removeMessage: (messageId: string) => Promise<void>;
}

class GroupChat implements IGroupChat {
	private _socket: Socket;

	constructor(socket: Socket) {
		this._socket = socket;
	}

	static async loginCheck({
		groupId,
		token,
	}: {
		groupId: string;
		token: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const user = await verifyToken(token);

		if (!user) {
			return {success: false, message: 'Not authenticated'};
		}

		try {
			const group = await Group.findOne({
				_id: groupId,
				members: user._id,
			});

			if (!group) {
				return {success: false, message: 'Group not found'};
			}
		} catch {
			return {success: false, message: 'Group not found'};
		}

		return {success: true};
	}

	error(err: Error): void {
		logger.error(`socket.id: ${this._socket.id}`);
		logger.error(err);

		this._socket.emit('user_error');
	}

	async getMessages({groupId}: {groupId: string}): Promise<IMessage[]> {
		const messages = await Message.find({chatId: groupId})
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

export default GroupChat;
