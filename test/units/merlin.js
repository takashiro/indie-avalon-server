
const assert = require('assert');
const read = require('../readStream');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

module.exports = {
	name: 'Merlin forecast',
	run: async function testStatus(client) {
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

		let minions = [];
		let forecasted = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			res = await client.get('role', {id: room.id, seat, seatKey: seat});
			assert.strictEqual(res.statusCode, 200);

			let result = await read(res);
			let role = Role.fromNum(result.role);
			if (role.team === Team.Minion) {
				minions.push(seat);
			} else if (role === Role.Merlin) {
				forecasted = result.minions;
			}
		}
		assert(minions.length > 0, 'There is no minion');
		assert(forecasted, 'Merlin skill is not invoked');
		assert.strictEqual(minions.length, forecasted.length);

		minions.sort();
		forecasted.sort();
		for (let i = 0; i < minions.length; i++) {
			assert.strictEqual(minions[i], forecasted[i]);
		}

		console.log('Delete the room');
		res = await client.delete('room', {id: room.id});
		assert.strictEqual(res.statusCode, 200);

		let deleted = await read(res);
		assert.strictEqual(room.id, deleted.id);
	}
};
