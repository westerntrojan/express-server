import cloudinary from 'cloudinary';

export const removeImage = async (publicId: string): Promise<boolean> => {
	const {result} = await cloudinary.v2.uploader.destroy(publicId);

	if (result === 'not found') {
		return false;
	}

	return true;
};
