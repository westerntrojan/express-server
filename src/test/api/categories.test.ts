import {expect} from 'chai';
import {agent as request} from 'supertest';

import server from '../../server';
import {resetApp} from '../utils';

describe('Categories Test', () => {
	beforeEach(async () => resetApp());

	it('expect GET /api/v1/categories', async () => {
		const res = await request(server).get('/api/v1/categories');

		expect(res.status).to.equal(200);
		expect(res.body.categories).to.be.an('array');
		expect(res.body.categories).to.be.not.empty;
	});

	it('expect GET /api/v1/categories/:slug', async () => {
		const slug = 'event';

		const res = await request(server).get(`/api/v1/categories/${slug}`);

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
		expect(res.body.category).to.be.an('object');
		expect(res.body.category).to.be.not.empty;
		expect(res.body.category.slug).to.equal(slug);
	});
});
