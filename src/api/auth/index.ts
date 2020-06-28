import {Router} from 'express';

import loginRotuer from './login';
import registerRotuer from './register';
import verifyRotuer from './verify';
import passwordResetRouter from './password_reset';

const router = Router();

router.use('/login', loginRotuer);
router.use('/register', registerRotuer);
router.use('/verify', verifyRotuer);
router.use('/password_reset', passwordResetRouter);

export default router;
