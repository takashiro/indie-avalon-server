
const assert = require('assert');
const read = require('../readStream');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

module.exports = {
	name: 'Mordred vision',
	run: async function testStatus(client) {
		let res;

		// Create a new room
		console.log('Create a room');
		let roles = [
			Role.Loyal,
			Role.Loyal,
			Role.Loyal,
			Role.Merlin,
			Role.Merlin,
			Role.Percival,

			Role.Morgana,
			Role.Assassin,
			Role.Rebel,
			Role.Oberon,
			Role.Mordred,
			Role.Mordred,
		];
		res = await client.post('room', {roles: roles.map(role => role.toNum())});
		assert.strictEqual(res.statusCode, 200);

		let room = await read(res);
		let rebelNum = 0;
		for (let role of roles) {
			if (role.team === Team.Rebel && role !== Role.Oberon) {
				rebelNum++;
			}
		}

		// Test Mordred skill
		let merlinVisions = [];
		let rebelVisions = [];
		let mordreds = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			res = await client.get('role', {id: room.id, seat, seatKey: seat});
			assert.strictEqual(res.statusCode, 200);

			let result = await read(res);
			let role = Role.fromNum(result.role);
			if (role === Role.Oberon) {
				assert(!result.mates || result.mates.length <= 0, 'Oberon cannot see other rebels');
			} else if (role.team === Team.Rebel) {
				rebelVisions.push([seat, ...result.mates]);
				if (role === Role.Mordred) {
					mordreds.push(seat);
				}
			} else if (role === Role.Merlin) {
				merlinVisions.push(result.rebels);
			}
		}

		// Confirm all rebel visions are the same
		assert(rebelVisions[0].length > 0, 'Rebels should know each other');
		assert(rebelVisions[0].length === rebelNum, 'The number of rebels is incorrect');
		rebelVisions[0].sort();
		for (let i = 0; i < rebelVisions.length; i++) {
			assert(rebelVisions[i].length === rebelNum, 'The number of rebels is incorrect');
			rebelVisions[i].sort();
			for (let j = 0; j < rebelNum; j++) {
				assert(rebelVisions[0][j], rebelVisions[i][j]);
			}
		}

		// Confirm Merlin cannot see Mordred
		for (let mordred of mordreds) {
			for (let rebels of merlinVisions) {
				assert(rebels.indexOf(mordred) < 0, 'Merlin should not see Mordred');
			}
		}

		// Delete the room
		console.log('Delete the room');
		res = await client.delete('room', {id: room.id});
		assert.strictEqual(res.statusCode, 200);

		let deleted = await read(res);
		assert.strictEqual(room.id, deleted.id);
	}
};
