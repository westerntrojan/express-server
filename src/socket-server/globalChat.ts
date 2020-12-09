import {Socket, Server} from 'socket.io';

import GlobalChat from './utils/GlobalChat';
import {IMessage} from '../models/Message';

export default (io: Server) => {
	let users = 0;

	const main = io.of('/global');

	main.on('connection', (client: Socket) => {
		const chatUtil = new GlobalChat(client);

		client.on('disconnect', () => {
			main.emit('active_users', {count: users ? --users : users});
		});

		client.on('error', (err: Error) => {
			chatUtil.error(err);
		});

		client.on('user_connect', async () => {
			try {
				main.emit('active_users', {count: ++users});

				const messages = await chatUtil.getMessages();

				client.emit('pre_messages', {messages});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('new_message', async (data: {message: IMessage}) => {
			try {
				const message = await chatUtil.newMessage(data.message);

				main.emit('new_message', {message});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('preload_message', async (data: {message: IMessage}) => {
			try {
				const message = await chatUtil.preloadMessage(data.message);

				client.emit('new_message', {message});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('message_loaded', async (data: {message: IMessage}) => {
			try {
				const result = await chatUtil.messageLoaded(data.message);

				if (result) {
					client.emit('update_message', {message: result.forMe});
					client.broadcast.emit('new_message', {message: result.forOther});
				}
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('cancel_loading_message', async (data: {message: IMessage}) => {
			try {
				const messageId = await chatUtil.cancelLoadingMessage(data.message);

				client.emit('remove_messages', {messages: [messageId]});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('update_message', async (data: {message: IMessage}) => {
			try {
				const message = await chatUtil.updateMessage(data.message);

				main.emit('update_message', {message});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('read_message', async (data: {messageId: string}) => {
			try {
				await chatUtil.readMessage(data.messageId);

				main.emit('read_message', {messageId: data.messageId});
			} catch (err) {
				chatUtil.error(err);
			}
		});

		client.on('remove_messages', async (data: {messages: string[]}) => {
			try {
				await Promise.all(data.messages.map(async (_id: string) => chatUtil.removeMessage(_id)));

				main.emit('remove_messages', {messages: data.messages});
			} catch (err) {
				chatUtil.error(err);
			}
		});
	});
};
