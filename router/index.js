const router = require('express').Router();

const articlesRouter = require('./articles');
const authRouter = require('./auth');

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);

module.exports = router;
