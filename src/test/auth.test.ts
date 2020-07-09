import {expect} from 'chai';
import {agent as request} from 'supertest';

import server from '../server';

describe('Auth Test', () => {
	it('should POST /api/v1/auth/login with fake user', async () => {
		const res = await request(server)
			.post('/api/v1/auth/login')
			.send({
				userLink: 'some_username',
				password: 'some_password',
			});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(false);
		expect(res.body.message).to.equal('User not found');
	});

	it('should POST /api/v1/auth/register with exists user', async () => {
		const res = await request(server)
			.post('/api/v1/auth/register')
			.send({
				firstName: 'Jack',
				lastName: 'Anderson',
				email: 'jack@gmail.com',
				password: 'password',
			});

		expect(res.status).to.equal(200);
		expect(res.body.success).to.equal(false);
		expect(res.body.message).to.equal('User exists');
	});
});
