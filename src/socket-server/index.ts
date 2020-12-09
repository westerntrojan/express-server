import http from 'http';
import socketIo from 'socket.io';

import globalChat from './globalChat';
import directChat from './directChat';
import groupChat from './groupChat';

export default (httpServer: http.Server) => {
	const io = socketIo(httpServer);

	globalChat(io);
	directChat(io);
	groupChat(io);
};
