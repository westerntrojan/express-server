import {Schema, model, Document} from 'mongoose';

enum Type {
	TEXT = 'text',
	IMAGE = 'image',
	IMAGE_CAPTION = 'image_caption',
}

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
		default: '',
		trim: true,
	},
	image: {
		type: String,
		default: '',
	},
	caption: {
		type: String,
		default: '',
		trim: true,
	},
	type: {
		type: String,
		default: Type.TEXT,
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
	image?: string;
	caption?: string;
	type: string;
	created?: string;
}

export default model<IMessage>('messages', MessageSchema);
