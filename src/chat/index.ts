import http from 'http';
import socketIo from 'socket.io';
import redis from 'redis';
import {Document} from 'mongoose';

import Message, {MessageInterface} from '../Models/Message';

const redisSub = redis.createClient();
const redisPub = redis.createClient();

const getMessages = async (limit = 10): Promise<MessageInterface[]> =>
	await Message.find()
		.populate('user')
		.limit(limit)
		.sort({created: 1});

export default (server: http.Server): void => {
	const io = socketIo(server);

	let users = 0;

	io.on('connection', client => {
		console.log('connection');
		io.sockets.emit('active_users', ++users);
		(async (): Promise<void> => {
			client.emit('pre_messages', await getMessages(10));
		})();

		client.on('disconnect', () => {
			console.log('disconnect');
			io.sockets.emit('active_users', --users);
		});

		client.on('error', (err: Error) => {
			console.log('received error from client:', client.id);
			console.log(err);
		});

		client.on('new_message', async message => {
			let newMessage: Document | null = await Message.create(message);
			newMessage = await Message.findById(newMessage._id).populate('user');

			redisPub.publish('new_message', JSON.stringify(newMessage));
		});
		redisSub.subscribe('new_message');
		redisSub.on('message', (channel, message) => {
			io.sockets.emit('new_message', JSON.parse(message));
		});

		client.on('remove_messages', async messages => {
			messages.map(async (_id: string) => await Message.findByIdAndRemove(_id));
			io.sockets.emit('remove_messages', messages);
		});
	});
};
