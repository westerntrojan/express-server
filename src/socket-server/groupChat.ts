import {Socket, Server} from 'socket.io';

import GroupChat from './utils/GroupChat';
import {IMessage} from '../models/Message';

export default (io: Server) => {
	let groupId: string;

	const group = io.of('/group');

	group.use(async (socket, next) => {
		const query = socket.handshake.query;

		const result = await GroupChat.loginCheck({groupId: query.groupId, token: query.token});

		if (!result.success) {
			return next(new Error(result.message));
		}

		groupId = query.groupId;

		next();
	});

	group.on('connection', (client: Socket) => {
		const chatUtil = new GroupChat(client);

		client.join(groupId);

		client.on('error', (err: Error) => {
			chatUtil.error(err);
		});

		client.on('user_connect', async () => {
			try {
				const messages = await chatUtil.getMessages({groupId});

				client.emit('pre_messages', {messages});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('new_message', async (data: {message: IMessage}) => {
			try {
				const message = await chatUtil.newMessage({...data.message, chatId: groupId});

				group.to(groupId).emit('new_message', {message});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('remove_messages', async (data: {messages: string[]}) => {
			try {
				await Promise.all(data.messages.map(async message => chatUtil.removeMessage(message)));

				group.to(groupId).emit('remove_messages', {messages: data.messages});
			} catch (err) {
				chatUtil.error(err);
			}
		});
	});
};
