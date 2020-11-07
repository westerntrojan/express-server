import {Request, Response, NextFunction} from 'express';

import SearchService from '../services/search.service';

class SearchController {
	async search(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await SearchService.search({searchQuery: String(req.query.search_query)});

			res.json({result});
		} catch (err) {
			next(err);
		}
	}
}

export default new SearchController();
