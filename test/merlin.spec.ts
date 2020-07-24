import supertest from 'supertest';
import {
	Role,
	RoleMap,
	Team,
} from '@karuta/avalon-core';

import VisionItem from '../src/driver/VisionItem';
import app from '../src/app';

const agent = supertest(app);

const roles = [
	Role.Servant,
	Role.Servant,
	Role.Servant,
	Role.Merlin,
	Role.Percival,

	Role.Morgana,
	Role.Assassin,
	Role.Minion,
];

const room = {
	id: 0,
	ownerKey: '',
};

beforeAll(async () => {
	const res = await agent.post('/room').send({ roles }).expect(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});

test('Merlin vision', async () => {
	const minions = [];
	let forecasted = [];
	for (let i = 0; i < roles.length; i++) {
		const seat = i + 1;
		const res = await agent.post(`/room/${room.id}/seat/${seat}`).send({ seatKey: String(seat) }).expect(200);
		const role = res.body.role as Role;
		const team = RoleMap.get(role);
		if (team === Team.Minion) {
			minions.push(seat);
		} else if (role === Role.Merlin) {
			forecasted = res.body.others.map((other: VisionItem) => other.seat);
		}
	}
	expect(minions.length).toBeGreaterThan(0);
	expect(forecasted.length).toBe(minions.length);

	minions.sort();
	forecasted.sort();
	expect(minions).toStrictEqual(forecasted);
});
