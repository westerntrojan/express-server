const Sequelize = require('sequelize');

const sequelize = new Sequelize('forum', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

module.exports = sequelize;
