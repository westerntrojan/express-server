import passportJwt from 'passport-jwt';

import User from '../../models/User';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const jwt_signature = String(process.env.JWT_SIGNATURE);

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: String(jwt_signature),
};

export default new JwtStrategy(options, async ({data}, done) => {
	try {
		const user = await User.findOne({
			_id: data.userId,
			emailVerified: true,
			isRemoved: false,
		});

		if (!user) {
			return done(null, false);
		}

		return done(null, user.getValidUser());
	} catch (err) {
		return done(err, false);
	}
});
