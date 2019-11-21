import {Model, DataTypes} from 'sequelize';
import slugify from 'slugify';

import db from '../db';

class Tag extends Model {
	public tag_id!: number;
	public name!: string;
	public slug!: string;

	public readonly created_at!: Date;
	public readonly updated_at!: Date;
}

Tag.init(
	{
		tag_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: new DataTypes.STRING(255),
			allowNull: false,
		},
		slug: {
			type: new DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		sequelize: db,
		tableName: 'tag',
		indexes: [
			{
				fields: ['name', 'slug'],
				unique: true,
			},
		],
	},
);

Tag.beforeValidate(tag => {
	tag.slug = slugify(tag.name, {
		lower: true,
		replacement: '-',
	});
});

export default Tag;
