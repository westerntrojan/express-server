import request from 'supertest';

import app from '../app';

describe('app', () => {
	it('[GET] /api/articles', () => {
		request(app)
			.get('/api/articles')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err: Error) => {
				if (err) throw err;
			});
	});
});
