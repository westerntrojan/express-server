import {expect} from 'chai';
import {agent as request} from 'supertest';

import server from '../../server';
import {resetApp} from '../utils';

type TestUser = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

const getTestUser = (): TestUser => ({
	firstName: 'Alex',
	lastName: 'Ferguson',
	email: 'alex@gmail.com',
	password: 'password',
});
describe('Auth Test', () => {
	beforeEach(async () => resetApp());

	it('expect POST /api/v1/auth/register', async () => {
		const testUser = getTestUser();

		const res = await request(server)
			.post('/api/v1/auth/register')
			.send(testUser);

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
	});

	it('expect POST /api/v1/auth/register with exists user', async () => {
		const testUser = getTestUser();

		await request(server)
			.post('/api/v1/auth/register')
			.send(testUser);

		const res = await request(server)
			.post('/api/v1/auth/register')
			.send(testUser);

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(false);
		expect(res.body.message).to.equal('User exists');
	});

	it('expect POST /api/v1/auth/login', async () => {
		const testUser = getTestUser();

		await request(server)
			.post('/api/v1/auth/register')
			.send(testUser);

		const res = await request(server)
			.post('/api/v1/auth/login')
			.send({
				userLink: testUser.email,
				password: testUser.password,
			});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
		expect(res.body.user).to.be.an('object');
		expect(res.body.token).to.be.an('string');
	});

	it('expect POST /api/v1/auth/login with fake user', async () => {
		const res = await request(server)
			.post('/api/v1/auth/login')
			.send({
				userLink: 'some username',
				password: 'some password',
			});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(false);
		expect(res.body.message).to.equal('User not found');
	});

	it('expect GET /api/v1/auth/verify', async () => {
		const testUser = getTestUser();

		await request(server)
			.post('/api/v1/auth/register')
			.send(testUser);

		const {
			body: {token},
		} = await request(server)
			.post('/api/v1/auth/login')
			.send({
				userLink: testUser.email,
				password: testUser.password,
			});

		const res = await request(server)
			.get('/api/v1/auth/verify')
			.auth(token, {type: 'bearer'});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(true);
		expect(res.body.user).to.be.not.empty;
	});

	it('expect GET /api/v1/auth/verify with fake token', async () => {
		const testUser = getTestUser();

		const res = await request(server)
			.get('/api/v1/auth/verify')
			.auth('some token', {type: 'bearer'});

		expect(res.status).to.equal(401);
		expect(res.text).to.equal('Unauthorized');
	});
});
