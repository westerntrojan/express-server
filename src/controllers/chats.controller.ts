import {Request, Response, NextFunction} from 'express';

import ChatsService from '../services/chats.service';

class ChatsController {
	async getChatId(req: Request, res: Response, next: NextFunction) {
		try {
			const {user1, user2} = req.params;

			const chatId = await ChatsService.getChatId({user1, user2});

			res.json({chatId});
		} catch (err) {
			next(err);
		}
	}

	async getUserChats(req: Request, res: Response, next: NextFunction) {
		try {
			const chats = await ChatsService.getUserChats({userId: req.params.userId});

			res.json({chats});
		} catch (err) {
			next(err);
		}
	}

	async removeChat(req: Request, res: Response, next: NextFunction) {
		try {
			await ChatsService.removeChat({chatId: req.params.chatId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}
}

export default new ChatsController();
