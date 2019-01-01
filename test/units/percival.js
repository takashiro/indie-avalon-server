
const assert = require('assert');
const read = require('../readStream');

const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');

class PercivalTest extends UnitTest {

	constructor() {
		super('Percival vision');
	}

	async run(client) {
		let res;

		console.log('Create a room');
		let roles = [
			Role.Servant,
			Role.Servant,
			Role.Servant,
			Role.Merlin,
			Role.Percival,

			Role.Morgana,
			Role.Assassin,
			Role.Minion,
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

}

module.exports = PercivalTest;
