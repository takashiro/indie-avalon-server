import supertest from 'supertest';

import app from '../src/app';

const agent = supertest.agent(app);

const room = {
	id: 0,
	ownerKey: '',
};
const roles = [1, 1, 1, 2, 3, 4];
const api = {
	quest: '',
	quests: '',
};

describe('Room 1', () => {
	beforeAll(async () => {
		const res = await agent.post('/room').send({ roles });
		Object.assign(room, res.body);
		expect(room.id).toBeGreaterThan(0);
		api.quest = `/room/${room.id}/quest`;
		api.quests = `/room/${room.id}/quests`;
	});

	afterAll(async () => {
		await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	});

	const players = [0];
	it('fetches all roles', async () => {
		for (let seat = 1; seat <= roles.length; seat++) {
			const res = await agent.post(`/room/${room.id}/seat/${seat}`).send({ seatKey: String(seat) })
				.expect(200);
			players.push(res.body);
		}
	});

	test('room id', async () => {
		await agent.post('/room/abc/quest').send({ members: [] })
			.expect(400, 'Invalid room id');
		await agent.post(`/room/${room.id + 1}/quest`).send({ members: [] })
			.expect(404, 'The room does not exist');
	});

	test('invalid leader seat number', async () => {
		await agent.post(api.quest).send({ members: [1, 2, 3] })
			.expect(400, 'Invalid leader seat number');
		await agent.post(api.quest).send({ members: [1, 2, 3], seat: 10 })
			.expect(400, 'Leader seat number does not exist');
	});

	test('invalid leader seat key', async () => {
		await agent.post(api.quest).send({ members: [1, 2, 3], seat: 1 })
			.expect(403, 'Invalid leader seat key');
		await agent.post(api.quest).send({ members: [1, 2, 3], seat: 1, seatKey: 2 })
			.expect(403, 'Invalid leader seat key');
	});

	test('invalid quest members', async () => {
		await agent.post(api.quest).send({ members: {}, seat: 1, seatKey: '1' })
			.expect(400, '`members` must be an array of integers');
	});

	it('creates a quest', async () => {
		await agent.post(api.quest).send({ members: [1, 2], seat: 1, seatKey: '1' })
			.expect(200, { seq: 1 });
	});

	test('invalid member seat', async () => {
		await agent.post(api.quest).send({ questCard: true, seat: 10, seatKey: '1' })
			.expect(400, 'Invalid seat number');
	});

	test('invalid member seat key', async () => {
		await agent.post(api.quest).send({ questCard: false, seat: 2 })
			.expect(400, 'Seat and seat key is required to complete a quest');
		await agent.post(api.quest).send({ questCard: false, seat: 2, seatKey: '1' })
			.expect(403, 'Incorrect seat key');
	});

	it('joins Quest 1 (Seat 1)', async () => {
		await agent.post(api.quest).send({ questCard: true, seat: 1, seatKey: '1' })
			.expect(200, { seq: 1, questCard: true });
	});

	it('joins duplicated quest', async () => {
		await agent.post(api.quest).send({ questCard: false, seat: 1, seatKey: '1' })
			.expect(200, { seq: 1 });
	});

	it('joins Quest 1 (Seat 2)', async () => {
		await agent.post(api.quest).send({ questCard: true, seat: 2, seatKey: '2' })
			.expect(200, { seq: 1, questCard: true });
	});

	const quest1 = {
		seq: 1,
		leader: 1,
		members: [1, 2],
		successNum: 2,
		failureNum: 0,
		successful: true,
	};
	it('checks quest result', async () => {
		await agent.get(api.quest).expect(200, quest1);
	});

	it('posts incorrect number of members', async () => {
		await agent.post(api.quest).send({ members: [2, 3], seat: 5, seatKey: '5' })
			.expect(400, 'Invalid number of members');
	});

	it('creates Quest 2 (Seat 5)', async () => {
		await agent.post(api.quest).send({ members: [2, 3, 4], seat: 5, seatKey: '5' })
			.expect(200, { seq: 2 });
	});

	it('posts Quest 2', async () => {
		await agent.post(api.quest).send({ questCard: true, seat: 2, seatKey: '2' })
			.expect(200);
		await agent.post(api.quest).send({ questCard: false, seat: 3, seatKey: '3' })
			.expect(200);
		await agent.post(api.quest).send({ questCard: true, seat: 4, seatKey: '4' })
			.expect(200);
	});

	const quest2 = {
		seq: 2,
		leader: 5,
		members: [2, 3, 4],
		successNum: 2,
		failureNum: 1,
		successful: false,
	};
	it('checks Quest 2', async () => {
		await agent.get(api.quest).expect(200, quest2);
	});

	const quest3 = {
		seq: 3,
		leader: 6,
		members: [2, 4, 5, 6],
		successNum: 0,
		failureNum: 0,
		successful: false,
	};
	it('creates Quest 3', async () => {
		await agent.post(api.quest).send({ members: quest3.members, seat: 6, seatKey: '6' })
			.expect(200, { seq: 3 });
	});

	it('creates duplicate quest', async () => {
		await agent.post(api.quest).send({ members: [2, 4, 5], seat: 2, seatKey: '2' })
			.expect(400, 'A quest is still on going');
	});

	it('fetches quests', async () => {
		await agent.get(api.quests).expect(200, [quest1, quest2, quest3]);
	});
});

describe('Room 2', () => {
	beforeAll(async () => {
		const res = await agent.post('/room').send({ roles: [1, 1, 1, 2, 3, 4, 5, 6] });
		Object.assign(room, res.body);
		api.quest = `/room/${room.id}/quest`;
		api.quests = `/room/${room.id}/quests`;

		for (let seat = 1; seat <= roles.length; seat++) {
			await agent.post(`/room/${room.id}/seat/${seat}`).send({ id: room.id, seat, seatKey: String(seat) });
		}
	});

	afterAll(async () => {
		await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
			.expect(200, { id: room.id });
	});

	test('Quest 1', async () => {
		await agent.post(api.quest).send({ members: [1, 2, 3], seat: 1, seatKey: '1' })
			.expect(200, { seq: 1 });
		for (let seat = 1; seat <= 3; seat++) {
			await agent.post(api.quest).send({ questCard: true, seat, seatKey: String(seat) })
				.expect(200, { seq: 1, questCard: true });
		}
	});

	test('Quest 2', async () => {
		await agent.post(api.quest).send({ members: [1, 2, 3, 4], seat: 1, seatKey: '1' })
			.expect(200, { seq: 2 });
		for (let seat = 1; seat <= 4; seat++) {
			await agent.post(api.quest).send({ questCard: true, seat, seatKey: String(seat) })
				.expect(200, { seq: 2, questCard: true });
		}
	});

	test('Quest 3', async () => {
		await agent.post(api.quest).send({ members: [1, 2, 3, 4], seat: 1, seatKey: '1' })
			.expect(200, { seq: 3 });
		for (let seat = 1; seat <= 4; seat++) {
			const questCard = seat % 2 == 1;
			await agent.post(api.quest).send({ questCard, seat, seatKey: String(seat) })
				.expect(200, { seq: 3, questCard });
		}
	});

	test('Quest 4', async () => {
		await agent.post(api.quest).send({ members: [1, 2, 3, 4, 5], seat: 1, seatKey: '1' })
			.expect(200, { seq: 4 });
		for (let seat = 1; seat <= 5; seat++) {
			const questCard = seat > 1;
			await agent.post(api.quest).send({ questCard, seat, seatKey: String(seat) })
				.expect(200, { seq: 4, questCard });
		}
	});

	it('fetches protected quest', async () => {
		const quest = {
			seq: 4,
			leader: 1,
			members: [1, 2, 3, 4, 5],
			successNum: 4,
			failureNum: 1,
			successful: true,
		};
		await agent.get(api.quest)
			.expect(200, quest);
	});
});
