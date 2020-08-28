import {Router} from 'express';
import passport from 'passport';

import {registerValidators} from '../../middlewares/validators';
import AuthController from '../../controllers/auth.controller';

const router = Router();

router.post('/login', AuthController.login);

router.post('/login/code', AuthController.verifyCode);

router.post('/register', registerValidators, AuthController.register);

router.get(
	'/register/verify',
	passport.authenticate('registerVerify', {session: false}),
	AuthController.registerVerify,
);

router.post(
	'/password_reset',
	passport.authenticate('passwordResetVerify', {session: false}),
	AuthController.passwordReset,
);

router.post('/password_reset/email', AuthController.passwordResetSendEmail);

router.get(
	'/password_reset/verify',
	passport.authenticate('passwordResetVerify', {session: false}),
	AuthController.passwordResetVerify,
);

router.get('/verify', AuthController.verify);

export default router;
