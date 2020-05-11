import moment from 'moment';

type NotFoundError = {
	timestamp: string;
	status: number;
	error: string;
};

export const getNotFoundError = (): NotFoundError => ({
	timestamp: moment().format(),
	status: 404,
	error: 'Not Found',
});
