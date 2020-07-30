import {expect} from 'chai';
import {agent as request} from 'supertest';

import server from '../../server';
import {login, resetApp, getTestArticle} from '../utils';

describe('Articles API Test', () => {
	beforeEach(async () => resetApp());

	it('expect GET /api/v1/articles', async () => {
		const res = await request(server).get('/api/v1/articles');

		expect(res.status).to.equal(200);
		expect(res.body.articles).to.be.an('array');
		expect(res.body.articles).to.be.empty;
	});

	it('expect POST /api/v1/articles without token', async () => {
		const {user} = await login();

		const testArticle = await getTestArticle({userId: user._id});

		const res = await request(server)
			.post('/api/v1/articles')
			.send(testArticle);

		expect(res.status).to.equal(401);
		expect(res.text).to.equal('Unauthorized');
	});

	it('expect POST /api/v1/articles', async () => {
		const {user, token} = await login();

		const {title, text, tags, category, userId} = await getTestArticle({userId: user._id});

		const res = await request(server)
			.post('/api/v1/articles')
			.send({
				title,
				text,
				tags,
				category,
				user: userId,
			})
			.auth(token, {type: 'bearer'});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
		expect(res.body.article).to.be.an('object');
		expect(res.body.article).to.be.not.empty;
		expect(res.body.article).have.property('_id');
	});

	it('expect GET /api/v1/articles/:slug', async () => {
		const {user, token} = await login();

		const {title, text, tags, category, userId} = await getTestArticle({userId: user._id});

		const {
			body: {article},
		} = await request(server)
			.post('/api/v1/articles')
			.send({
				title,
				text,
				tags,
				category,
				user: userId,
			})
			.auth(token, {type: 'bearer'});

		const res = await request(server).get(`/api/v1/articles/${article.slug}`);

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
		expect(res.body.article).to.be.an('object');
		expect(res.body.article).to.be.not.empty;
		expect(res.body.article)
			.have.property('_id')
			.eql(article._id);
	});

	it('expect PUT /api/v1/articles/:id', async () => {
		const {user, token} = await login();

		const {title, text, tags, category, userId} = await getTestArticle({userId: user._id});

		const {
			body: {article},
		} = await request(server)
			.post('/api/v1/articles')
			.send({
				title,
				text,
				tags,
				category,
				user: userId,
			})
			.auth(token, {type: 'bearer'});

		const newTitle = 'Title updated';

		const res = await request(server)
			.put(`/api/v1/articles/${article._id}`)
			.field('title', newTitle)
			.field('userId', user._id)
			.auth(token, {type: 'bearer'});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
		expect(res.body.article).to.be.an('object');
		expect(res.body.article).to.be.not.empty;
		expect(res.body.article.title).to.equal(newTitle);
	});

	it('expect DELETE /api/v1/articles/:id', async () => {
		const {user, token} = await login();

		const {title, text, tags, category, userId} = await getTestArticle({userId: user._id});

		const {
			body: {article},
		} = await request(server)
			.post('/api/v1/articles')
			.send({
				title,
				text,
				tags,
				category,
				user: userId,
			})
			.auth(token, {type: 'bearer'});

		const res = await request(server)
			.delete(`/api/v1/articles/${article._id}`)
			.auth(token, {type: 'bearer'});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
	});
});
