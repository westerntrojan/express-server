import http from 'http';
import socketIo from 'socket.io';
import {Document} from 'mongoose';

import Message from '../Models/Message';

export default (server: http.Server) => {
	const io = socketIo(server);

	io.on('connection', client => {
		console.log('connection');
		let users = 0;
		io.sockets.emit('active_users', {count: ++users});

		client.on('disconnect', () => {
			console.log('disconnect');
			io.sockets.emit('active_users', {count: ++users});
		});

		client.on('error', (err: Error) => {
			console.log('received error from client:', client.id);
			console.log(err);
		});

		client.on('new_message', async message => {
			let newMessage: Document | null = await Message.create(message);
			newMessage = await Message.findById(newMessage._id).populate('user');

			io.sockets.emit('new_message', {message: newMessage});
		});

		client.on('remove_message', _id => {
			io.sockets.emit('remove_message', {_id});
		});

		client.on('typing', user => {
			client.broadcast.emit('typing', {user});
		});

		client.on('not-typing', user => {
			client.broadcast.emit('not-typing', {user});
		});
	});
};
