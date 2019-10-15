import {Request, Response, Router} from 'express';
import formidable from 'formidable';
import path from 'path';

const router = Router();

router.post('/', (req: Request, res: Response) => {
	const form = new formidable.IncomingForm();

	form.parse(req);

	form.on('fileBegin', (name, file) => {
		console.log(name);
		file.path = path.resolve(__dirname, '../..', 'upload', file.name);
	});

	form.on('file', () => {
		res.end();
	});
});

export default router;
