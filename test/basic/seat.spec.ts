import supertest from 'supertest';

import app from '../../src/app';
import randstr from '../../src/util/randstr';

const agent = supertest.agent(app);

const roles = [1, 1, 2, 2, 3, 4];
const my = {
	seat: 1 + Math.floor(Math.random() * roles.length),
};
const room = {
	id: 0,
	ownerKey: '',
};

beforeAll(async () => {
	const res = await agent.post('/room')
		.send({ roles });
	Object.assign(room, res.body);
});

afterAll((async () => {
	await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
}));

test('invalid room id', async () => {
	await agent.post('/room/1000/seat/1')
		.expect(404, 'Room does not exist');
});

test('invalid seat key', async () => {
	await agent.post(`/room/${room.id}/seat/${my.seat}`)
		.expect(400, 'Invalid seat key');
});

test('fetching roles', async () => {
	const takenSeats: number[] = [];
	for (let i = 0; i < roles.length; i++) {
		const seatKey = randstr(32);
		const seat = i + 1;
		const res = await agent.post(`/room/${room.id}/seat/${seat}`)
			.send({ seatKey })
			.expect(200);
		if (res.body.role) {
			takenSeats.push(res.body.role);
		} else {
			throw new Error('No role is found');
		}

		await agent.post(`/room/${room.id}/seat/${seat}`)
			.expect(400, 'Invalid seat key');

		await agent.post(`/room/${room.id}/seat/${seat}`)
			.send({ seatKey: seatKey + 1 })
			.expect(403, 'Seat has been taken');
	}
	expect(takenSeats.length).toBe(roles.length);

	takenSeats.sort();
	for (let i = 0; i < takenSeats.length; i++) {
		expect(roles[i]).toBe(takenSeats[i]);
	}
});
