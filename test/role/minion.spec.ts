import supertest from 'supertest';
import {
	Role,
	roleMap,
	Team,
} from '@karuta/avalon-core';

import VisionItem from '../../src/driver/VisionItem.js';
import app from '../../src/app.js';

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

test('Minion vision', async () => {
	const visions: number[][] = [];
	for (let i = 0; i < roles.length; i++) {
		const seat = i + 1;
		const res = await agent.post(`/room/${room.id}/seat/${seat}`).send({ seatKey: String(seat) }).expect(200);
		const role = res.body.role as Role;
		const team = roleMap.get(role);
		if (team === Team.Minion) {
			visions.push([seat, ...res.body.others.map((other: VisionItem) => other.seat)]);
		}
	}
	expect(visions.length).toBe(3);

	for (const vision of visions) {
		vision.sort();
	}
	for (let i = 1; i < visions.length; i++) {
		expect(visions[i]).toStrictEqual(visions[0]);
	}
});
