const router = require('express').Router();

router.use('/articles', require('./articles'));
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));

module.exports = router;
