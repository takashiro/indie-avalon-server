
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

class MordredTest extends UnitTest {

	constructor() {
		super('Mordred vision');
	}

	async run() {
		// Create a new room
		console.log('Create a room');
		let roles = [
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
		await this.post('room', {roles: roles.map(role => role.toNum())});
		let room = await this.getJSON();
		let minionNum = 0;
		for (let role of roles) {
			if (role.team === Team.Minion && role !== Role.Oberon) {
				minionNum++;
			}
		}

		// Test Mordred skill
		let merlinVisions = [];
		let minionVisions = [];
		let mordreds = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			await this.get('role', {id: room.id, seat, seatKey: seat});
			let result = await this.getJSON();
			let role = Role.fromNum(result.role);
			if (role === Role.Oberon) {
				assert(!result.mates || result.mates.length <= 0, 'Oberon cannot see other minions');
			} else if (role.team === Team.Minion) {
				minionVisions.push([seat, ...result.mates]);
				if (role === Role.Mordred) {
					mordreds.push(seat);
				}
			} else if (role === Role.Merlin) {
				merlinVisions.push(result.minions);
			}
		}

		// Confirm all minion visions are the same
		assert(minionVisions[0].length > 0, 'Minions should know each other');
		assert(minionVisions[0].length === minionNum, 'The number of minions is incorrect');
		minionVisions[0].sort();
		for (let i = 0; i < minionVisions.length; i++) {
			assert(minionVisions[i].length === minionNum, 'The number of minions is incorrect');
			minionVisions[i].sort();
			for (let j = 0; j < minionNum; j++) {
				assert(minionVisions[0][j], minionVisions[i][j]);
			}
		}

		// Confirm Merlin cannot see Mordred
		for (let mordred of mordreds) {
			for (let minions of merlinVisions) {
				assert(minions.indexOf(mordred) < 0, 'Merlin should not see Mordred');
			}
		}

		// Delete the room
		console.log('Delete the room');
		await this.delete('room', {id: room.id});
		let deleted = await this.getJSON();
		assert.strictEqual(room.id, deleted.id);
	}
}

module.exports = MordredTest;
