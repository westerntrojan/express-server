import {Request, Response, NextFunction} from 'express';

import ChatsService from '../services/chats.service';

class ChatsController {
	async getUserChats(req: Request, res: Response, next: NextFunction) {
		try {
			const chats = await ChatsService.getUserChats({userId: req.params.userId});

			res.json({chats});
		} catch (err) {
			next(err);
		}
	}

	async deleteChat(req: Request, res: Response, next: NextFunction) {
		try {
			await ChatsService.deleteChat({chatId: req.params.chatId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}

	async deleteChatMessages(req: Request, res: Response, next: NextFunction) {
		try {
			await ChatsService.deleteChatMessages({chatId: req.params.chatId});

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}
}

export default new ChatsController();
