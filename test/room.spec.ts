import request from 'supertest';
import app from '../src/app';

const agent = request.agent(app);

it('creates a room', async () => {
	const roles = [1, 2, 3, 4, 5];

	const res = await agent.post('/room')
		.send({ roles });
	expect(res.status).toBe(200);
	const room = res.body;
	expect(room.roles.length).toBe(roles.length);
	for (const role of room.roles) {
		expect(roles.includes(role));
	}

	expect(room.questLeader > 0 && room.questLeader <= roles.length);

	const status = await agent.get('/status');
	expect(status.body.roomNum).toBe(1);

	const del = await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(del.status).toBe(200);
	expect(del.body.id).toBe(room.id);
});

it('handles invalid requests', async () => {
	await agent.get('/room/abc')
		.expect(400, 'Invalid room id');
});
