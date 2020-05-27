import passportJwt from 'passport-jwt';
import config from 'config';

import User from '../../models/User';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const jwt_signature = config.get('jwt_signature');

const options = {
	jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
	secretOrKey: String(jwt_signature),
};

export default new JwtStrategy(options, async (jwt_payload, done) => {
	try {
		const user = await User.findOne({email: jwt_payload.data.email, emailVerified: true});

		if (!user) {
			return done(null, false);
		}

		return done(null, user._id);
	} catch (err) {
		return done(err, false);
	}
});
