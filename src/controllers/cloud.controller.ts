import {Request, Response, NextFunction} from 'express';

import CloudService from '../services/cloud.service';

class CloudController {
	async removeResource(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await CloudService.removeResource({
				publicId: String(req.query.public_id),
				resourceType: req.params.resource_type,
			});

			if (!result.success) {
				res.json({success: false, message: result.message});
			}

			res.json({success: true});
		} catch (err) {
			next(err);
		}
	}
}

export default new CloudController();
