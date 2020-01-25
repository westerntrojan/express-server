import bcrypt from 'bcryptjs';

export const hash = async (value: string): Promise<string> => {
	return bcrypt.hash(value, 10);
};

export const compare = async (value: string, hashedValue: string): Promise<boolean> => {
	return bcrypt.compare(value, hashedValue);
};
