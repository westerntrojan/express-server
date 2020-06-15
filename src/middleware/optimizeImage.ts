import {Request, Response, NextFunction} from 'express';

import {optimizeImage} from '../utils/imagemin';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (req.file) {
		await optimizeImage(`src/uploads/${req.body.userId}/${req.file.filename}`);
	}

	next();
};
