import {Schema, model, Document} from 'mongoose';

const Chat: Schema = new Schema({
	user1: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	user2: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IChat extends Document {
	user1: string;
	user2: string;
	created?: Date;
}

export default model<IChat>('chats', Chat);
