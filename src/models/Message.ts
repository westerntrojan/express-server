import {Schema, model, Document} from 'mongoose';

const MessageSchema: Schema = new Schema({
	chatId: {
		type: Schema.Types.ObjectId,
		ref: 'user-chats',
		default: null,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	text: {
		type: String,
		required: true,
		trim: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IMessage extends Document {
	chatId?: string | null;
	user: string;
	text: string;
	created?: string;
}

export default model<IMessage>('messages', MessageSchema);
