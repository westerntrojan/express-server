import bcrypt from 'bcryptjs';

export const hash = async (value: string): Promise<string> => {
	return await bcrypt.hash(value, 10);
};

export const compare = async (value: string, hashedValue: string): Promise<boolean> => {
	return await bcrypt.compare(value, hashedValue);
};
