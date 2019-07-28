const router = require('express').Router();
const {validationResult} = require('express-validator');

const {articleValidators, commentValidators} = require('../utils/validators');

const Article = require('../models/Article');
const Comment = require('../models/Comment');

router.get('/', async (req, res) => {
	const articles = await Article.find()
		.sort({created_at: -1})
		.populate('comments', null, null, {sort: {created_at: -1}});

	res.json({articles});
});

router.post('/', articleValidators, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const article = await Article.create(req.body);

	res.json({article});
});

router.get('/:articleId', async (req, res) => {
	const article = await Article.findById(req.params.articleId).populate('comments', null, null, {
		sort: {created_at: -1},
	});

	res.json({article});
});

router.put('/:articleId', articleValidators, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const article = await Article.findOneAndUpdate(
		{_id: req.params.articleId},
		{$set: req.body},
		{new: true}
	).populate('comments', null, null, {sort: {created_at: -1}});

	res.json({article});
});

router.delete('/:articleId', async (req, res) => {
	const article = await Article.findOneAndRemove({_id: req.params.articleId});
	await Comment.deleteMany({articleId: req.params.articleId});

	res.json({article});
});

router.get('/views/:articleId', async (req, res) => {
	const article = await Article.findById(req.params.articleId).populate('comments', null, null, {
		sort: {created_at: -1},
	});
	article.views = article.views + 1;
	article.save();

	res.json({article});
});

router.post('/comments/add', commentValidators, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const comment = await Comment.create(req.body);
	const article = await Article.findById(req.body.articleId);

	article.comments.push(comment._id);
	await article.save();

	res.json({comment});
});

module.exports = router;
