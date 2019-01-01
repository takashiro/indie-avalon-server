
const assert = require('assert');
const read = require('../readJSON');

const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

class MinionTest extends UnitTest {
	constructor() {
		super('minion vision');
	}

	async run(client) {
		let res;

		// Create a new room
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

		// Test minion vision
		let visions = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			res = await client.get('role', {id: room.id, seat, seatKey: seat});
			assert.strictEqual(res.statusCode, 200);

			let result = await read(res);
			let role = Role.fromNum(result.role);
			if (role.team === Team.Minion) {
				visions.push([seat, ...result.mates]);
			}
		}
		assert(visions.length > 0, 'There is no minion vision');
		assert(visions[0], 'Minion vision skill is not invoked');

		visions[0].sort();
		for (let i = 0; i < visions.length; i++) {
			assert.strictEqual(visions[0].length, visions[i].length);

			visions[i].sort();
			for (let j = 0; j < visions[0].length; j++) {
				assert.strictEqual(visions[0][j], visions[i][j]);
			}
		}

		// Delete the room
		console.log('Delete the room');
		res = await client.delete('room', {id: room.id});
		assert.strictEqual(res.statusCode, 200);

		let deleted = await read(res);
		assert.strictEqual(room.id, deleted.id);
	}
}

module.exports = MinionTest;
