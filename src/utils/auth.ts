const bcrypt = require('bcryptjs');

exports.hash = async (value: string) => {
	return await bcrypt.hash(value, 10);
};

exports.compare = async (value: string, hashedValue: string) => {
	return await bcrypt.compare(value, hashedValue);
};
