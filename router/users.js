const router = require('express').Router();
const {validationResult} = require('express-validator');

const User = require('../models/User');
const UserSession = require('../models/UserSession');
const {editUserValidators} = require('../utils/validators');

router.put('/:userId', editUserValidators, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const user = await User.findOneAndUpdate(
		{_id: req.params.userId, isRemoved: false},
		{$set: req.body},
		{new: true}
	);

	res.json({user});
});

router.delete('/:userId', async (req, res) => {
	const user = await User.findOneAndUpdate(
		{_id: req.params.userId, isRemoved: false},
		{$set: {isRemoved: true}},
		{new: true}
	);

	await UserSession.findOneAndUpdate(
		{userId: req.params.userId, isRemoved: false},
		{$set: {isRemoved: true}},
		{new: true}
	);

	res.json({user});
});

module.exports = router;
