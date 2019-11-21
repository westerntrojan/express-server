import {Model, DataTypes} from 'sequelize';

import db from '../db';

class ArticlesTags extends Model {
	public article_id!: number;
	public tag_id!: number;

	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

ArticlesTags.init(
	{
		article_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		tag_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: 'article_tag',
	},
);

export default ArticlesTags;
