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
	Role.Merlin,
	Role.Percival,

	Role.Morgana,
	Role.Assassin,
	Role.Morgana,
	Role.Assassin,
	Role.Minion,
	Role.Minion,
	Role.Oberon,
	Role.Oberon,
];

const room = {
	id: 0,
	ownerKey: '',
};

let minionNum = 0;
for (const role of roles) {
	if (roleMap.get(role) === Team.Minion && role !== Role.Oberon) {
		minionNum++;
	}
}

beforeAll(async () => {
	const res = await agent.post('/room').send({ roles }).expect(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	await agent.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200, { id: room.id });
});

const visions: number[][] = [];
const oberons: number[] = [];
const merlinVisions: number[][] = [];
it('fetches all visions', async () => {
	for (let i = 0; i < roles.length; i++) {
		const seat = i + 1;
		const res = await agent.post(`/room/${room.id}/seat/${seat}`).send({ seatKey: String(seat) }).expect(200);
		const role = res.body.role as Role;
		if (role === Role.Oberon) {
			// Confirms Oberon cannot see other minions
			expect(!res.body.others || res.body.others.length <= 0);
			oberons.push(seat);
		} else if (roleMap.get(role) === Team.Minion) {
			visions.push([seat, ...res.body.others.map((other: VisionItem) => other.seat)]);
		} else if (role === Role.Merlin) {
			merlinVisions.push(res.body.others.map((other: VisionItem) => other.seat));
		}
	}
});

it('confirms all minion visions are the same', () => {
	expect(visions[0].length).toBeGreaterThan(0);
	expect(visions[0].length).toBe(minionNum);

	for (const vision of visions) {
		vision.sort();
	}
	for (let i = 0; i < visions.length; i++) {
		expect(visions[i]).toHaveLength(minionNum);
		expect(visions[i]).toStrictEqual(visions[0]);
	}
});

it('confirms Oberon cannot be seen by other minions', () => {
	for (const oberon of oberons) {
		expect(visions[0].includes(oberon)).toBe(false);
	}
});

it('confirms Merlin can see Oberon', () => {
	for (const oberon of oberons) {
		for (const minions of merlinVisions) {
			expect(minions.includes(oberon)).toBe(true);
		}
	}
});
