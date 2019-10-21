import mongoose, {Schema, model, Document} from 'mongoose';

delete mongoose.connection.models['messages'];

const MessageSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface MessageInterface extends Document {
	user: string;
	text: string;
	created: string;
}

export default model<MessageInterface>('messages', MessageSchema);
