import {Model, DataTypes} from 'sequelize';

import db from '../db';

class Comment extends Model {
	public commentId!: number;
	public text!: string;
	public articleId!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Comment.init(
	{
		commentId: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
			field: 'comment_id',
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		articleId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			field: 'article_id',
		},
		createdAt: {
			type: DataTypes.DATE,
			field: 'created_at',
		},
		updatedAt: {
			type: DataTypes.DATE,
			field: 'updated_at',
		},
	},
	{
		sequelize: db,
		tableName: 'comment',
		underscored: true,
	},
);

export default Comment;
