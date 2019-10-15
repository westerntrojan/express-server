import {Request, Response, Router} from 'express';

import Message from '../models/Message';

const router = Router();

router.get('/messages', async (req: Request, res: Response) => {
	const messages = await Message.find()
		.populate('user')
		.limit(10)
		.sort({created: 1});

	res.json({messages});
});

export default router;
