import {Request, Response, Router} from 'express';
import formidable from 'formidable';
import path from 'path';

import getLogger from '../utils/logger';

const router = Router();

const logger = getLogger(module);

router.post('/', (req: Request, res: Response) => {
	const form = new formidable.IncomingForm();

	form.parse(req);

	form.on('fileBegin', (name, file) => {
		file.path = path.resolve(__dirname, '../..', 'upload', file.name);
	});

	form.on('error', (err: Error) => {
		logger.error(err);
		return res.json({error: 'Error. Try again'});
	});

	form.on('file', () => {
		res.end();
	});
});

export default router;
