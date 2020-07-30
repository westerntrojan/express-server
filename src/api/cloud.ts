import {Router, Request, Response, NextFunction} from 'express';
import cloudinary from 'cloudinary';

import {removeImage} from '../utils/images';

const router = Router();

router.delete('/:resource_type', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const public_id = String(req.query.public_id);
		const resource_type = req.params.resource_type;

		const resource_types = ['image', 'video', 'audio'];

		if (!resource_types.includes(resource_type)) {
			return res.json({success: false, message: 'Icnorrect resource type'});
		}

		if (resource_type === 'image') {
			const result = await removeImage(public_id);

			if (!result) {
				return res.json({success: false, message: 'Not found'});
			}
		}

		if (resource_type === 'video' || resource_type === 'audio') {
			const result = await cloudinary.v2.api.delete_resources([public_id], {
				resource_type: 'video',
			});

			if (result.deleted[public_id] === 'not_found') {
				return res.json({success: false, message: 'Not found'});
			}
		}

		res.json({success: true});
	} catch (err) {
		next(err);
	}
});

export default router;
