import multer from 'multer';
import slugify from 'slugify';
import {v4 as uuidv4} from 'uuid';
import shelljs from 'shelljs';
import path from 'path';
import Url from 'url-parse';

export const getPathToImage = (url: string): string => {
	const pathnameArray = new Url(url).pathname.split('/');

	const userId = pathnameArray[pathnameArray.length - 2];
	const imageName = pathnameArray[pathnameArray.length - 1];

	const pathToImage = path.resolve(__dirname, '../../uploads', userId, imageName);

	return pathToImage;
};

export const removeImage = (url: string): void => {
	if (url) {
		const pathToImage = getPathToImage(url);

		shelljs.rm('-rf', pathToImage);
	}
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (req.body.oldImage) {
			removeImage(req.body.oldImage);
		}

		const pathToImageFolder = path.resolve(__dirname, '../../uploads', req.body.userId);

		shelljs.mkdir('-p', pathToImageFolder);

		cb(null, pathToImageFolder);
	},
	filename: (req, file, cb) => {
		const filename = slugify(file.originalname, {
			lower: true,
			replacement: '-'
		});

		cb(null, uuidv4() + '-' + filename);
	}
});

export const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const filetypes = /jpg|png|jpeg/;

		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		if (extname && mimetype) {
			return cb(null, true);
		}

		// fix
		cb({message: 'Invalid file type'} as any);
	},
	limits: {fileSize: 5 * 1024 * 1024}
});
