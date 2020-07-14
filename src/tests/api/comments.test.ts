import {agent as request} from 'supertest';
import {expect} from 'chai';

import server from '../../server';
import {login, resetApp, getTestArticle} from '../utils';

type TestComment = {
	articleId: string;
	text: string;
	user: string;
};

const getTestComment = ({articleId, userId}: {articleId: string; userId: string}): TestComment => ({
	text: 'Some comment',
	articleId,
	user: userId,
});

describe('Comments API Test', () => {
	beforeEach(async () => resetApp());

	it('expect POST /api/v1/articles/comments', async () => {
		const {user, token} = await login();

		const {title, text, tags, category, userId} = await getTestArticle({userId: user._id});

		const {
			body: {article},
		} = await request(server)
			.post('/api/v1/articles')
			.field('title', title)
			.field('text', text)
			.field('tags', JSON.stringify(tags))
			.field('category', category)
			.field('userId', userId)
			.auth(token, {type: 'bearer'});

		const testComment = getTestComment({articleId: article._id, userId: user._id});

		const res = await request(server)
			.post('/api/v1/articles/comments')
			.send(testComment)
			.auth(token, {type: 'bearer'});

		expect(res.status).to.equal(200);
		expect(res.body.comment).to.be.an('object');
		expect(res.body.comment).not.to.be.empty;
		expect(res.body.comment).have.property('_id');
	});
});
