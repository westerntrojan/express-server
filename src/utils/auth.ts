import bcrypt from 'bcryptjs';

export const hash = async (value: string) => {
	return await bcrypt.hash(value, 10);
};

export const compare = async (value: string, hashedValue: string) => {
	return await bcrypt.compare(value, hashedValue);
};
