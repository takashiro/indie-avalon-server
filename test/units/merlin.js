
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

		let rebels = [];
		let forecasted = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			res = await client.get('role', {id: room.id, seat, seatKey: seat});
			assert.strictEqual(res.statusCode, 200);

			let result = await read(res);
			let role = Role.fromNum(result.role);
			if (role.team === Team.Rebel) {
				rebels.push(seat);
			} else if (role === Role.Merlin) {
				forecasted = result.rebels;
			}
		}
		assert(rebels.length > 0, 'There is no rebel');
		assert(forecasted, 'Merlin skill is not invoked');
		assert.strictEqual(rebels.length, forecasted.length);

		rebels.sort();
		forecasted.sort();
		for (let i = 0; i < rebels.length; i++) {
			assert.strictEqual(rebels[i], forecasted[i]);
		}

		console.log('Delete the room');
		res = await client.delete('room', {id: room.id});
		assert.strictEqual(res.statusCode, 200);

		let deleted = await read(res);
		assert.strictEqual(room.id, deleted.id);
	}
};
