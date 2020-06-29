import {Router, Request, Response, NextFunction} from 'express';
import formidable from 'formidable';

import {uploadImage, removeImage} from '../utils/images';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
	try {
		const form = new formidable.IncomingForm();

		form.parse(req, async (err, fields, files) => {
			if (err) {
				return res.json({success: false, message: 'Error. Try again'});
			}

			const result = await uploadImage(files.image, {
				folder: 'test',
				tags: ['test', 'example'],
			});

			if (!result.success) {
				return res.json({success: false, message: result.message});
			}

			res.json({success: true, image: result.public_id});
		});
	} catch (err) {
		next(err);
	}
});

router.delete('/:public_id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await removeImage(req.params.public_id);

		if (!result) {
			return res.json({success: false, message: 'Not found'});
		}

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

export default router;
