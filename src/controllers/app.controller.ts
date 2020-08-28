import {Request, Response, NextFunction} from 'express';

import AppService from '../services/app.service';

class AppController {
	async resetApp(req: Request, res: Response, next: NextFunction) {
		try {
			const {categories} = await AppService.resetApp();

			res.json({success: true, categories});
		} catch (err) {
			next(err);
		}
	}
}

export default new AppController();
