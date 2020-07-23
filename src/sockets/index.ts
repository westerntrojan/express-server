import http from 'http';
import socketIo from 'socket.io';

import main from './chats/main';
import users from './chats/users';
import user from './user';

export default (server: http.Server): void => {
	const io = socketIo(server);

	main(io);
	users(io);
	user(io);
};
