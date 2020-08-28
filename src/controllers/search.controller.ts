import {Request, Response, NextFunction} from 'express';

import SearchService from '../services/search.service';

class SearchController {
	async search(req: Request, res: Response, next: NextFunction) {
		const result = await SearchService.search({searchQuery: String(req.query.search_query)});

		res.json({result});
	}
}

export default new SearchController();
