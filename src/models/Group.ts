import {Schema, model, Document} from 'mongoose';

const GroupSchema: Schema = new Schema({
	admin: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	avatar: {
		color: {
			type: String,
			default: '',
		},
		image: {
			type: String,
			default: '',
		},
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
	],
	created: {
		type: Date,
		default: Date.now,
	},
});

export interface IGroup extends Document {
	admin: string;
	name: string;
	avatar: {
		color: string;
		image: string;
	};
	members: string[];
	created: string;
}

export default model<IGroup>('groups', GroupSchema);
