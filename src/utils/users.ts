import User, {IUser} from '../models/User';

export const getUserByLink = async (
	userLink: string,
	condition?: object,
): Promise<IUser | null> => {
	try {
		const [byEmail, byUsername] = await Promise.all([
			User.findOne({email: userLink, ...condition}),
			User.findOne({username: userLink, ...condition}),
		]);

		if (byEmail) {
			return byEmail;
		}

		if (byUsername) {
			return byUsername;
		}

		const byId = await User.findById(userLink, condition);

		return byId;
	} catch {
		return null;
	}
};
