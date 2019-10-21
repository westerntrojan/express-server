import http from 'http';
import socketIo from 'socket.io';

import Chat from '../utils/chat';

export default (server: http.Server): void => {
	const io = socketIo(server);

	let users = 0;

	io.on('connection', client => {
		console.log('connection');
		const chat = new Chat(client);

		client.on('disconnect', () => {
			console.log('disconnect');

			io.sockets.emit('active_users', --users);
		});

		client.on('error', (err: Error) => {
			chat.error(err);
		});

		io.sockets.emit('active_users', ++users);

		(async (): Promise<void> => {
			try {
				client.emit('pre_messages', await chat.getMessages(10));
			} catch (err) {
				chat.error(err);
			}
		})();

		client.on('new_message', async message => {
			try {
				const newMessage = await chat.newMessage(message);

				io.sockets.emit('new_message', newMessage);
			} catch (err) {
				chat.error(err);
			}
		});

		client.on('remove_messages', async messages => {
			try {
				messages.map(async (_id: string) => await chat.removeMessage(_id));

				client.emit('remove_messages', messages);
			} catch (err) {
				chat.error(err);
			}
		});
	});
};
