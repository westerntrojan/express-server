import {Model, DataTypes} from 'sequelize';

import db from '../db';

class Comment extends Model {
	public comment_id!: number;
	public text!: string;
	public article_id!: number;

	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

Comment.init(
	{
		comment_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		article_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: 'comment',
	},
);

export default Comment;
