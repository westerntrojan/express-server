import {Model, DataTypes} from 'sequelize';

import db from '../db';

class ArticlesTags extends Model {
	public articleId!: number;
	public tagId!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

ArticlesTags.init(
	{
		articleId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			field: 'article_id',
		},
		tagId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			field: 'tag_id',
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
		tableName: 'article_tag',
		underscored: true,
	},
);

export default ArticlesTags;
