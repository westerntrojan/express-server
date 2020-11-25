import jwt from 'jsonwebtoken';
import User, {IValidUser} from '../models/User';

import {IUser} from '../models/User';

const jwt_signature = String(process.env.JWT_SIGNATURE);

export const generateToken = (user: IUser): string => {
	const data = {
		userId: user._id,
		email: user.email,
	};
	const signature = String(jwt_signature);
	const expiresIn = '6h';

	return jwt.sign({data}, signature, {expiresIn});
};

export const verifyToken = async (token: string): Promise<null | IValidUser> => {
	try {
		const decoded: any = jwt.verify(token, jwt_signature);

		const user = await User.findOne({
			_id: decoded.data.userId,
			emailVerified: true,
			isRemoved: false,
		});

		if (!user) {
			return null;
		}

		return user.getValidUser();
	} catch (e) {
		return null;
	}
};
