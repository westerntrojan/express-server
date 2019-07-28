const Sequelize = require('sequelize');
const sequelize = require('../db');

const Article = sequelize.define('Article', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	text: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	image: {
		type: Sequelize.STRING,
		default: '',
	},
	views: {
		type: Sequelize.INTEGER,
		default: 0,
	},
});

module.exports = Article;
