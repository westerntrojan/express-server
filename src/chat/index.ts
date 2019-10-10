import http from 'http';
import socketIo from 'socket.io';
import redis from 'redis';
import {Document} from 'mongoose';

import Message from '../Models/Message';

const redisSub = redis.createClient();
const redisPub = redis.createClient();

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

			redisPub.publish('new_message', JSON.stringify({message: newMessage}));
		});

		redisSub.subscribe('new_message');
		redisSub.on('message', (channel, message) => {
			io.sockets.emit('new_message', JSON.parse(message));
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
