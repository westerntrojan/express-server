import {Router} from 'express';

import login from './login';
import register from './register';
import verify from './verify';
import password_reset from './password_reset';

const router = Router();

router.use('/login', login);
router.use('/register', register);
router.use('/verify', verify);
router.use('/password_reset', password_reset);

export default router;
