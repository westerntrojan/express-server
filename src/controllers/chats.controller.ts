import {Request, Response, NextFunction} from 'express';
import formidable from 'formidable';

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

	addImage(req: Request, res: Response, next: NextFunction) {
		try {
			const form = new formidable.IncomingForm();

			form.parse(req, async (err, fields, files) => {
				if (err) {
					return res.json({success: false, message: 'Error. Try again'});
				}

				const result = await ChatsService.addImage({files});

				if (!result.success) {
					return res.json({success: false, message: result.message});
				}

				res.json({success: true, image: result.image});
			});
		} catch (err) {
			next(err);
		}
	}
}

export default new ChatsController();
