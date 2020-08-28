import {Request, Response, NextFunction} from 'express';

import DataService from '../services/data.service';

class DataController {
	async getArticleStatistics(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await DataService.getArticleStatistics();

			res.json({data});
		} catch (err) {
			next(err);
		}
	}
}

export default new DataController();
