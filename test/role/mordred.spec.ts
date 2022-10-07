import supertest from 'supertest';
import {
	Role,
	RoleMap,
	Team,
} from '@karuta/avalon-core';

import VisionItem from '../../src/driver/VisionItem';
import app from '../../src/app';

const agent = supertest(app);

const roles = [
	Role.Servant,
	Role.Servant,
	Role.Servant,
	Role.Merlin,
	Role.Merlin,
	Role.Percival,

	Role.Morgana,
	Role.Assassin,
	Role.Minion,
	Role.Oberon,
	Role.Mordred,
	Role.Mordred,
];

let minionNum = 0;
for (const role of roles) {
	if (RoleMap.get(role) === Team.Minion && role !== Role.Oberon) {
		minionNum++;
	}
}

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

const merlinVisions: number[][] = [];
const minionVisions: number[][] = [];
const mordreds: number[] = [];

it('fetches all visions', async () => {
	for (let i = 0; i < roles.length; i++) {
		const seat = i + 1;
		const res = await agent.post(`/room/${room.id}/seat/${seat}`).send({ seatKey: String(seat) }).expect(200);
		const role = res.body.role as Role;
		if (role === Role.Oberon) {
			expect(!res.body.others || res.body.others.length <= 0);
		} else if (RoleMap.get(role) === Team.Minion) {
			minionVisions.push([seat, ...res.body.others.map((other: VisionItem) => other.seat)]);
			if (role === Role.Mordred) {
				mordreds.push(seat);
			}
		} else if (role === Role.Merlin) {
			merlinVisions.push(res.body.others.map((other: VisionItem) => other.seat));
		}
	}
});

it('confirms all minion visions are the same', async () => {
	expect(minionVisions[0].length).toBeGreaterThan(0);
	expect(minionVisions[0].length).toBe(minionNum);

	for (const vision of minionVisions) {
		vision.sort();
	}
	for (let i = 1; i < minionVisions.length; i++) {
		expect(minionVisions[i]).toStrictEqual(minionVisions[0]);
	}
});

it('confirms Merlin cannot see Mordred', async () => {
	for (const mordred of mordreds) {
		for (const minions of merlinVisions) {
			expect(minions.includes(mordred)).toBe(false);
		}
	}
});
