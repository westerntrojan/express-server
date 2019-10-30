import http from 'http';
import socketIo from 'socket.io';

import mainChat from './mainChat';
import usersChat from './usersChat';

export default (server: http.Server): void => {
	const io = socketIo(server, {serveClient: false});

	mainChat(io);
	usersChat(io);
};
