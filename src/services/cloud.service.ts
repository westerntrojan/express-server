import cloudinary from 'cloudinary';

import {removeImage} from '../utils/images';

class CloudService {
	async removeResource({
		publicId,
		resourceType,
	}: {
		publicId: string;
		resourceType: string;
	}): Promise<{success: true} | {success: false; message: string}> {
		const resourceTypes = ['image', 'video', 'audio'];

		if (!resourceTypes.includes(resourceType)) {
			return {success: false, message: 'Icnorrect resource type'};
		}

		if (resourceType === 'image') {
			const result = await removeImage(publicId);

			if (!result) {
				return {success: false, message: 'Not found'};
			}
		}

		if (resourceType === 'video' || resourceType === 'audio') {
			const result = await cloudinary.v2.api.delete_resources([publicId], {
				resource_type: 'video',
			});

			if (result.deleted[publicId] === 'not_found') {
				return {success: false, message: 'Not found'};
			}
		}

		return {success: true};
	}
}

export default new CloudService();
