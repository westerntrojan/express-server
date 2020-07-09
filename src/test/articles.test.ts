import {expect} from 'chai';
import {agent as request} from 'supertest';

import server from '../server';
import {Article} from '../models';

type TestArticle = {
	title: string;
	text: string;
	tags: string[];
	category: string;
	user: string;
};

const getTestArticle = (): TestArticle => {
	return {
		title: 'Some title',
		text: 'Some text',
		tags: ['some tag', 'example', '123'],
		category: 'event',
		user: '5f02ef0f4f07774581d42f51',
	};
};

describe('Articles Test', () => {
	before(() => {
		return new Promise(async resolve => {
			await Article.deleteMany({});

			resolve();
		});
	});

	it('should GET /api/v1/articles', async () => {
		const res = await request(server).get('/api/v1/articles');

		expect(res.status).to.equal(200);
		expect(res.body.articles).to.be.empty;
		expect(res.body.articles).to.be.an('array');
	});

	it('should POST /api/v1/articles not auth', async () => {
		const testArticle = getTestArticle();

		const res = await request(server)
			.post('/api/v1/articles')
			.send(testArticle);

		expect(res.status).to.equal(401);
		expect(res.text).to.equal('Unauthorized');
	});
});
