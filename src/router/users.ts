import {Request, Response, Router} from 'express';
import {validationResult} from 'express-validator';

import User from '../models/User';
import Article from '../models/Article';
import Comment from '../models/Comment';
import Message from '../models/Message';
import {editUserValidators} from '../utils/validators';

const router = Router();

interface StatisticsInterface {
	articles: number;
	comments: number;
	messages: number;
}

const getStatistics = async (userId: string): Promise<StatisticsInterface> => {
	const articles = await Article.find({user: userId}).countDocuments();
	const comments = await Comment.find({user: userId}).countDocuments();
	const messages = await Message.find({user: userId}).countDocuments();

	return {articles, comments, messages};
};

router.get('/:userId', async (req: Request, res: Response) => {
	const user = await User.findById(req.params.userId);

	if (user) {
		const statistics = await getStatistics(req.params.userId);

		res.json({user: {...user._doc, ...statistics}});
	}
});

router.put('/:userId', editUserValidators, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({errors: errors.array()});
	}

	const user = await User.findOneAndUpdate({_id: req.params.userId}, {$set: req.body}, {new: true});

	if (user) {
		const statistics = await getStatistics(req.params.userId);

		res.json({user: {...user._doc, ...statistics}});
	}
});

export default router;
