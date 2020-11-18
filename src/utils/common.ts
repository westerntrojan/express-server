import slugify from 'slugify';

export const getUniqueCode = (): number => Math.floor(100000 + Math.random() * 900000); // Example - 341772

export const getSlug = (str: string): string => {
	return slugify(str, {
		lower: true,
		replacement: '-',
	});
};
