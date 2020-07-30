import {v4 as uuidv4} from 'uuid';
import cloudinary, {UploadApiOptions} from 'cloudinary';
import formidable from 'formidable';

const validateImage = (
	file: formidable.File,
): {success: true} | {success: false; message: string} => {
	const types = ['image/jpg', 'image/jpeg', 'image/png'];

	if (!types.includes(file.type)) {
		return {success: false, message: 'Invalid file type (only: jpg, jpeg, png)'};
	}

	if (file.size > 10 * 1024 * 1024) {
		return {success: false, message: 'Invalid file size (max: 10MB)'};
	}

	return {success: true};
};

export const uploadImage = async (
	image: formidable.File,
	options?: UploadApiOptions,
): Promise<{success: true; public_id: string} | {success: false; message: string}> => {
	const validateImageResult = validateImage(image);

	if (!validateImageResult.success) {
		return {success: false, message: validateImageResult.message};
	}

	const {public_id} = await cloudinary.v2.uploader.upload(image.path, {
		public_id: uuidv4(),
		async: true,
		...options,
	});

	return {success: true, public_id};
};

export const removeImage = async (public_id: string): Promise<boolean> => {
	const {result} = await cloudinary.v2.uploader.destroy(public_id);

	if (result === 'not found') {
		return false;
	}

	return true;
};
