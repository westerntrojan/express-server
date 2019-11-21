import {Router, Request, Response} from 'express';
import slugify from 'slugify';

import {Article, Comment, Tag} from '../sequelize';

const router = Router();

// test db
router.get('/', async (req: Request, res: Response) => {
	const {s} = req.query;

	const articles = await Article.findAll({
		where: {
			$or: [
				{
					title: {
						$like: `%${s}%`,
					},
				},
				{
					text: {
						$like: `%${s}%`,
					},
				},
			],
		},
	});

	res.json({articles});
});
router.get('/articles', async (req: Request, res: Response) => {
	const articles = await Article.findAll({
		include: [
			'comments',
			{
				model: Tag,
				as: 'tags',
				through: {attributes: []},
			},
		],
		order: [['created_at', 'DESC']],
	});

	res.json({articles});
});
router.get('/articles/add', async (req: Request, res: Response) => {
	const {title, text, tags} = req.query;

	const article = await Article.create({title, text});

	tags.split(',').map(async (name: string) => {
		const tag = await Tag.findOne({where: {name}});

		if (tag) {
			article.setTags([tag]);
		}
	});

	res.json({article});
});
router.get('/articles/:slug', async (req: Request, res: Response) => {
	const article = await Article.findOne({
		where: {slug: req.params.slug},
		include: [
			'comments',
			{
				model: Tag,
				as: 'tags',
				through: {attributes: []},
			},
		],
	});

	res.json({article});
});
router.get('/articles/update/:articleId', async (req: Request, res: Response) => {
	const {title, text, tags} = req.query;

	const slug = slugify(title, {
		lower: true,
		replacement: '-',
	});

	await Article.update(
		{title, text, slug},
		{
			where: {
				id: req.params.articleId,
			},
		},
	);

	const article = await Article.findByPk(req.params.articleId);

	if (article) {
		tags.split(',').map(async (name: string) => {
			const tag = await Tag.findOne({where: {name}});

			if (tag) {
				article.setTags([tag]);
			}
		});

		res.json({article});
	}
});
router.get('/articles/delete/:articleId', async (req: Request, res: Response) => {
	await Article.destroy({
		where: {
			id: req.params.articleId,
		},
	});

	res.json({success: true});
});
router.get('/articles/all/delete', async (req: Request, res: Response) => {
	await Article.destroy({
		where: {},
	});

	res.json({success: true});
});

// one to many
router.get('/comments', async (req: Request, res: Response) => {
	const comments = await Comment.findAll();

	res.json({comments});
});
router.get('/comments/add', async (req: Request, res: Response) => {
	const {text, article_id} = req.query;

	const comment = await Comment.create({text, article_id});

	res.json({comment});
});
router.get('/comments/:commentId', async (req: Request, res: Response) => {
	const comment = await Comment.findByPk(req.params.commentId);

	res.json({comment});
});

// many to many
router.get('/tags', async (req: Request, res: Response) => {
	const tags = await Tag.findAll();

	res.json({tags});
});
router.get('/tags/add', async (req: Request, res: Response) => {
	const {name} = req.query;

	const tag = await Tag.create({name});

	res.json({tag});
});
router.get('/tags/:slug', async (req: Request, res: Response) => {
	const tag = await Tag.findOne({where: {slug: req.params.slug}});

	res.json({tag});
});

export default router;
