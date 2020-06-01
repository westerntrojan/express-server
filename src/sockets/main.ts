import {Socket, Server} from 'socket.io';

import Chat from '../utils/chatUtils/main';
import {IMessage} from '../models/Message';

export default (io: Server): void => {
	let users = 0;

	const main = io.of('/main');

	// socket === client
	main.on('connection', (socket: Socket) => {
		console.log('[main] connection');

		const chat = new Chat(socket);

		socket.on('disconnect', () => {
			console.log('[main] disconnect');

			main.emit('active_users', {count: users ? --users : users});
		});

		socket.on('error', (err: Error) => {
			chat.error(err);
		});

		socket.on('user_connect', async () => {
			try {
				main.emit('active_users', {count: ++users});

				const preMessages = await chat.getMessages();

				socket.emit('pre_messages', {preMessages});
			} catch (err) {
				chat.error(err);
			}
		});

		socket.on('load_more', async (data: {skip: number}) => {
			try {
				const {messages, end} = await chat.loadMore(data.skip);

				socket.emit('load_more', {messages, end});
			} catch (err) {
				chat.error(err);
			}
		});

		socket.on('new_message', async (data: {newMessage: IMessage}) => {
			try {
				const newMessage = await chat.newMessage(data.newMessage);

				main.emit('new_message', {newMessage});
			} catch (err) {
				chat.error(err);
			}
		});

		socket.on('remove_messages', async (data: {removedMessages: string[]}) => {
			try {
				await Promise.all(data.removedMessages.map(async (_id: string) => chat.removeMessage(_id)));

				main.emit('remove_messages', {removedMessages: data.removedMessages});
			} catch (err) {
				chat.error(err);
			}
		});
	});
};
