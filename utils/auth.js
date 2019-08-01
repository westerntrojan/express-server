const bcrypt = require('bcryptjs');

exports.hash = async value => {
	return await bcrypt.hash(value, 10);
};

exports.compare = async (value, hashedValue) => {
	return await bcrypt.compare(value, hashedValue);
};
