import {Socket, Server} from 'socket.io';

import Chat from '@utils/chatUtils/main';

export default (io: Server): void => {
	let users = 0;

	const main = io.of('/main');

	main.on('connection', (socket: Socket) => {
		console.log('[main] connection');

		const chatUtils = new Chat(socket);

		socket.on('disconnect', () => {
			console.log('[main] disconnect');

			main.emit('active_users', users ? --users : users);
		});

		socket.on('error', (err: Error) => {
			chatUtils.error(err);
		});

		socket.on('user_connect', async () => {
			try {
				main.emit('active_users', ++users);

				socket.emit('pre_messages', await chatUtils.getMessages(10));
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
				await messages.map(async (_id: string) => await chatUtils.removeMessage(_id));

				main.emit('remove_messages', messages);
			} catch (err) {
				chatUtils.error(err);
			}
		});
	});
};
