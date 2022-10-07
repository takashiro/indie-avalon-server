import request from 'supertest';
import app from '../../src/app';

test('/status', async () => {
	const res = await request(app)
		.get('/status')
		.set('Accept', 'application/json');
	expect(res.status).toBe(200);
	expect(res.body).toStrictEqual({
		roomNum: 0,
		roomNumLimit: 1000,
	});
});
