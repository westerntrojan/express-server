import {Socket, Server} from 'socket.io';

import Chat from '../utils/chatUtils/main';

export default (io: Server): void => {
	const users = new Set();

	const main = io.of('/main');

	// socket === client
	main.on('connection', (socket: Socket) => {
		console.log('[main] connection');

		const chatUtils = new Chat(socket);

		socket.on('disconnect', (userId: string) => {
			console.log('[main] disconnect');

			users.delete(userId);
			main.emit('active_users', users.size);
		});

		socket.on('error', (err: Error) => {
			chatUtils.error(err);
		});

		socket.on('user_connect', async (userId: string) => {
			try {
				users.add(userId);
				main.emit('active_users', users.size);

				const messages = await chatUtils.getMessages(10);

				socket.emit('pre_messages', messages);
			} catch (err) {
				chatUtils.error(err);
			}
		});

		socket.on('new_message', async message => {
			try {
				const newMessage = await chatUtils.newMessage(message);

				main.emit('new_message', newMessage);
			} catch (err) {
				chatUtils.error(err);
			}
		});

		socket.on('remove_messages', async messages => {
			try {
				await Promise.all(messages.map(async (_id: string) => chatUtils.removeMessage(_id)));

				main.emit('remove_messages', messages);
			} catch (err) {
				chatUtils.error(err);
			}
		});
	});
};
