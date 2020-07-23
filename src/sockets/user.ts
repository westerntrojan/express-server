import {Socket, Server} from 'socket.io';

import {getLogger} from '../utils/logger';

const logger = getLogger(module);

export default (io: Server): void => {
	// namespace
	const user = io.of('/user');

	user.on('connection', (socket: Socket) => {
		console.log('[user] connection');

		socket.on('disconnect', () => {
			console.log('[users] disconnect');

			// save in db
		});

		socket.on('error', (err: Error) => {
			logger.error(`socket.id: ${socket.id}`);
			logger.error(err);

			socket.emit('user_error', {messages: 'Error. Try reload page'});
		});

		socket.on('user_connect', (userId: string) => {
			// save in db

			console.log('user_connect');
		});

		socket.on('isOnline', (userId: string) => {
			// return from database

			console.log('isOnline');
		});
	});
};
