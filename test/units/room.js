

const assert = require('assert');
const UnitTest = require('../UnitTest');

class RoomTest extends UnitTest {

	constructor() {
		super('create/enter/delete room');
	}

	async run() {
		await this.get('status');
		let status1 = await this.getJSON();

		console.log('Create a room');
		let roles = [1, 2, 3, 4, 5];
		await this.post('room', {roles});
		let room = await this.getJSON();
		assert.strictEqual(room.roles.length, roles.length);

		await this.get('room');
		await this.assertError(400, 'Invalid room id');
		await this.get('room', {test: 1});
		await this.assertError(400, 'Invalid room id');
		await this.get('room', {id: 'abc'});
		await this.assertError(400, 'Invalid room id');

		console.log('Check lobby status');
		await this.get('status');
		let status2 = await this.getJSON();
		assert.strictEqual(status1.roomNum + 1, status2.roomNum);

		console.log('Check roles');
		for (let role of room.roles) {
			assert(roles.indexOf(role) >= 0, 'Check roles');
		}

		console.log('Check quest leader');
		assert(room.questLeader > 0 && room.questLeader <= roles.length, 'Check quest leader');

		console.log('Delete a room');
		await this.delete('room', {id: room.id});
		await this.assertJSON({id: room.id});
	}

}

module.exports = RoomTest;
