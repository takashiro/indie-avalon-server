
const assert = require('assert');
const read = require('../readStream');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

module.exports = {
	name: 'Percival vision',
	run: async function testStatus(client) {
		let res;

		console.log('Create a room');
		let roles = [
			Role.Loyal,
			Role.Loyal,
			Role.Loyal,
			Role.Merlin,
			Role.Percival,

			Role.Morgana,
			Role.Assassin,
			Role.Rebel,
		];
		res = await client.post('room', {roles: roles.map(role => role.toNum())});
		assert.strictEqual(res.statusCode, 200);

		let room = await read(res);

		let magicians = [];
		let vision = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			res = await client.get('role', {id: room.id, seat, seatKey: seat});
			assert.strictEqual(res.statusCode, 200);

			let result = await read(res);
			let role = Role.fromNum(result.role);
			if (role === Role.Merlin || role === Role.Morgana) {
				magicians.push(seat);
			} else if (role === Role.Percival) {
				vision = result.magicians;
			}
		}
		assert(magicians.length > 0, 'There is no Merlin or Morgana');
		assert(vision, 'Percival skill is not invoked');
		assert.strictEqual(magicians.length, vision.length);

		magicians.sort();
		vision.sort();
		for (let i = 0; i < magicians.length; i++) {
			assert.strictEqual(magicians[i], vision[i]);
		}

		console.log('Delete the room');
		res = await client.delete('room', {id: room.id});
		assert.strictEqual(res.statusCode, 200);

		let deleted = await read(res);
		assert.strictEqual(room.id, deleted.id);
	}
};
