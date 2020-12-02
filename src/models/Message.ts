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
	audio: {
		type: String,
		default: '',
		trim: true,
	},
	text: {
		type: String,
		default: '',
		trim: true,
	},
	type: {
		type: String,
		default: 'text',
		trim: true,
	},
	loading: {
		type: Boolean,
		default: true,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	edited: {
		type: Boolean,
		default: false,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IMessage extends Document {
	chatId: string | null;
	user: string;
	audio: string;
	text: string;
	type: 'text' | 'audio';
	loading: boolean;
	isRead: boolean;
	edited: boolean;
	created: string;
}

export default model<IMessage>('messages', MessageSchema);
