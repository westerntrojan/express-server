import {Socket, Server} from 'socket.io';

import DirectChat from './utils/DirectChat';
import {IMessage} from '../models/Message';

export default (io: Server) => {
	let chatId: string;

	const users = io.of('/direct');

	users.use(async (socket, next) => {
		const query = socket.handshake.query;

		const result = await DirectChat.loginCheck({chatId: query.chatId, token: query.token});

		if (!result.success) {
			return next(new Error(result.message));
		}

		chatId = query.chatId;

		next();
	});

	users.on('connection', (client: Socket) => {
		const chatUtil = new DirectChat(client, chatId);

		client.join(chatId);

		client.on('error', (err: Error) => {
			chatUtil.error(err);
		});

		client.on('user_connect', async () => {
			try {
				const messages = await chatUtil.getMessages();

				client.emit('pre_messages', {messages});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('new_message', async (data: {message: IMessage}) => {
			try {
				const message = await chatUtil.newMessage({...data.message});

				users.to(chatId).emit('new_message', {message});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('remove_messages', async (data: {messages: string[]}) => {
			try {
				await Promise.all(data.messages.map(async message => chatUtil.removeMessage(message)));

				users.to(chatId).emit('remove_messages', {messages: data.messages});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('load_more', async () => {
			try {
				const messages = await chatUtil.getMessages();

				client.emit('load_more', {messages});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('typing', () => {
			try {
				client.to(chatId).emit('typing');
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('typing_end', () => {
			try {
				client.to(chatId).emit('typing_end');
			} catch (err) {
				chatUtil.error(err);
			}
		});
	});
};
