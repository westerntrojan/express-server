import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import path from 'path';

// const dirname = path.dirname(filePath);
// const isAbsolute = path.isAbsolute(filePath);
// const filename = path.basename(filePath);
// const extname = path.extname(filePath);
// const sep = path.sep;

const jpegToWebP = async (filePath: string): Promise<string> => {
	const result = await imagemin([filePath], {
		destination: path.dirname(filePath),
		plugins: [
			imageminWebp({
				quality: 75,
			}),
		],
	});

	if (result.length) {
		return path.basename(result[0].destinationPath);
	}

	return '';
};

const pngToWebP = async (filePath: string): Promise<string> => {
	const result = await imagemin([filePath], {
		destination: path.dirname(filePath),
		plugins: [
			imageminWebp({
				quality: 85,
			}),
		],
	});

	if (result.length) {
		return path.basename(result[0].destinationPath);
	}

	return '';
};

export const imageToWebp = async (filePath: string): Promise<string> => {
	const ext = path.extname(filePath);

	if (ext === '.jpg' || ext === '.jpeg') {
		return jpegToWebP(filePath);
	} else if (ext === '.png') {
		return pngToWebP(filePath);
	}

	return '';
};

export const optimizeImage = async (filePath: string): Promise<string> => {
	const result = await imagemin([filePath], {
		destination: path.dirname(filePath),
		plugins: [
			imageminMozjpeg({
				quality: 70,
				progressive: true,
			}),
			imageminPngquant({
				quality: [0.6, 0.8],
			}),
		],
	});

	if (result.length) {
		return path.basename(result[0].destinationPath);
	}

	return '';
};
