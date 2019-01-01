
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');

class PercivalTest extends UnitTest {

	constructor() {
		super('Percival vision');
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

		let magicians = [];
		let vision = [];
		for (let i = 0; i < roles.length; i++) {
			let seat = i + 1;
			await this.get('role', {id: room.id, seat, seatKey: seat});
			let result = await this.getJSON();
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
		await this.delete('room', {id: room.id});
		await this.assertJSON({id: room.id});
	}

}

module.exports = PercivalTest;
