import passportLocal from 'passport-local';

import {getUserByLink} from '../users';

const LocalStrategy = passportLocal.Strategy;

const options = {
	usernameField: 'userLink',
	passwordField: 'password',
};

export default new LocalStrategy(options, async (userLink, password, done) => {
	try {
		const user = await getUserByLink(userLink, {emailVerified: true, isRemoved: false});

		if (!user) {
			return done(null, false, {message: 'Invalid data'});
		}

		const correctPassword = await user.validatePassword(password);

		if (!correctPassword) {
			return done(null, false, {message: 'Invalid data'});
		}

		return done(null, user);
	} catch (err) {
		return done(err);
	}
});
