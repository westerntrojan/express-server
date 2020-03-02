import {Socket, Server} from 'socket.io';

import Chat from '../utils/chatUtils/users';

// room
let chatId: string;

export default (io: Server): void => {
	// namespace
	const users = io.of('/users');

	users.on('connection', (socket: Socket) => {
		console.log('[users] connection');

		const chatUtils = new Chat(socket);

		socket.on('disconnect', () => {
			console.log('[users] disconnect');
		});

		socket.on('error', (err: Error) => {
			chatUtils.error(err);
		});

		socket.on('user_connect', async data => {
			try {
				const chat = await chatUtils.findChat(data);

				if (chat) {
					chatId = chat._id;
					socket.join(chatId);

					const preMessages = await chatUtils.getMessages(chatId);

					socket.emit('pre_messages', {preMessages, chatId});
				} else {
					socket.emit('chat_not_found');
				}
			} catch (err) {
				chatUtils.error(err);
			}
		});

		socket.on('typing', () => {
			socket.to(chatId).emit('typing');
		});

		socket.on('typing_end', () => {
			socket.to(chatId).emit('typing_end');
		});

		socket.on('first_message', async message => {
			try {
				await chatUtils.newChat(message);
				const chat = await chatUtils.findChat(message);

				if (chat) {
					chatId = chat._id;
					socket.join(chatId);

					const newMessage = await chatUtils.newMessage({
						chatId,
						user: message.from,
						...message
					});

					users.in(chatId).emit('new_message', newMessage);
				}
			} catch (err) {
				chatUtils.error(err);
			}
		});

		socket.on('new_message', async message => {
			try {
				const newMessage = await chatUtils.newMessage({...message, chatId});

				users.in(chatId).emit('new_message', newMessage);
			} catch (err) {
				chatUtils.error(err);
			}
		});

		socket.on('remove_messages', async messages => {
			try {
				await messages.map(async (_id: string) => await chatUtils.removeMessage(_id));

				users.in(chatId).emit('remove_messages', messages);
			} catch (err) {
				chatUtils.error(err);
			}
		});
	});
};
