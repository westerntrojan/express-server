import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import {IUser} from '../models/User';

dotenv.config();

const jwt_signature = String(process.env.JWT_SIGNATURE);

export const generateToken = (user: IUser): string => {
	const data = {
		userId: user._id,
		email: user.email,
	};
	const signature = String(jwt_signature);
	const expiration = '4h';

	return jwt.sign({data}, signature, {expiresIn: expiration});
};
