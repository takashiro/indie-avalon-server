
const assert = require('assert');
const read = require('../readStream');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

module.exports = {
	name: 'rebel vision',
	run: async function testStatus(client) {
		let res;

		// Create a new room
		console.log('Create a room');
		let roles = [
			Role.Loyal,
			Role.Loyal,
			Role.Merlin,
			Role.Percival,

			Role.Morgana,
			Role.Assassin,
			Role.Morgana,
			Role.Assassin,
			Role.Rebel,
			Role.Rebel,
			Role.Oberon,
			Role.Oberon,
		];
		res = await client.post('room', {roles: roles.map(role => role.toNum())});
		assert.strictEqual(res.statusCode, 200);

		let room = await read(res);

		let rebelNum = 0;
		for (let role of roles) {
			if (role.team === Team.Rebel && role != Role.Oberon) {
				rebelNum++;
			}
		}

		// Test oberon skill
		let visions = [];
		let oberons = [];
		let merlinVisions = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			res = await client.get('role', {id: room.id, seat, seatKey: seat});
			assert.strictEqual(res.statusCode, 200);

			let result = await read(res);
			let role = Role.fromNum(result.role);
			if (role === Role.Oberon) {
				assert(!result.mates || result.mates.length <= 0, 'Oberon cannot see other rebels');
				oberons.push(seat);
			} else if (role.team === Team.Rebel) {
				visions.push([seat, ...result.mates]);
			} else if (role === Role.Merlin) {
				merlinVisions.push(result.rebels);
			}
		}

		// Confirm all rebel visions are the same
		assert(visions[0].length > 0, 'Rebels should know each other');
		assert(visions[0].length === rebelNum, 'The number of rebels is incorrect');
		visions[0].sort();
		for (let i = 0; i < visions.length; i++) {
			assert(visions[i].length === rebelNum, 'The number of rebels is incorrect');
			visions[i].sort();
			for (let j = 0; j < rebelNum; j++) {
				assert(visions[0][j], visions[i][j]);
			}
		}

		// Confirm Oberon cannot be seen by other rebels
		for (let rebel of visions[0]) {
			assert(oberons.indexOf(rebel) < 0, 'Rebels cannot see Oberon');
		}

		// Confirm Merlin can see Oberon
		for (let oberon of oberons) {
			for (let rebels of merlinVisions) {
				assert(rebels.indexOf(oberon) >= 0, 'Merlin should see Oberon');
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
