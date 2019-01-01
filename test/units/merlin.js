
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');
const Team = require('../../game/Team');

class MerlinTest extends UnitTest {

	constructor() {
		super('Merlin forecast');
	}

	async run() {
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
		await this.post('room', {roles: roles.map(role => role.toNum())});
		let room = await this.getJSON();

		let minions = [];
		let forecasted = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			await this.get('role', {id: room.id, seat, seatKey: seat});
			let result = await this.getJSON();
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
		await this.delete('room', {id: room.id});
		await this.assertJSON({id: room.id});
	}

}

module.exports = MerlinTest;
