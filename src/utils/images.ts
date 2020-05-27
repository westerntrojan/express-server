import {Request} from 'express';
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import shelljs from 'shelljs';
import path from 'path';
import Url from 'url-parse';
import tinify from 'tinify';

import {getSlug} from './app';

const getPathToImage = (url: string): string => {
	const pathnameArray = new Url(url).pathname.split('/');

	const userId = pathnameArray[pathnameArray.length - 2];
	const imageName = pathnameArray[pathnameArray.length - 1];

	const pathToImage = path.resolve(__dirname, '../uploads', userId, imageName);

	return pathToImage;
};

export const removeImage = (url: string): string => {
	if (!url) {
		return '';
	}

	const pathToImage = getPathToImage(url);

	shelljs.rm('-rf', pathToImage);

	return pathToImage;
};

export const getImageUrl = (req: Request): string => {
	if (req.file) {
		const source = tinify.fromFile(req.file.path);
		source.toFile(req.file.path);

		const currentUrl = req.protocol + '://' + req.get('host');
		const imageUrl = `${currentUrl}/static/${req.body.userId}/${req.file.filename}`;

		return imageUrl;
	} else if (req.body.imagePreview) {
		return req.body.imagePreview;
	}

	return '';
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const pathToImageFolder = path.resolve(__dirname, '../uploads', req.body.userId);

		shelljs.mkdir('-p', pathToImageFolder);

		cb(null, pathToImageFolder);
	},
	filename: (req, file, cb) => {
		const filename = getSlug(file.originalname);

		cb(null, uuidv4() + '-' + filename);
	},
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

		cb(new Error('Invalid file type'));
	},
	limits: {fileSize: 5 * 1024 * 1024},
});
