import http from 'http';
import socketIo from 'socket.io';

import main from './main';
import users from './users';

export default (server: http.Server): void => {
	// reconnectionDelay: 10
	const io = socketIo(server, {serveClient: false});

	main(io);
	users(io);
};
