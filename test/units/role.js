
const assert = require('assert');
const read = require('../readJSON');

const UnitTest = require('../UnitTest');
const randstr = require('../../util/randstr');

class RoleTest extends UnitTest {

	constructor() {
		super('Take seat');
	}

	async run() {
		console.log('Create a room');
		let roles = [1, 1, 2, 2, 3, 4];
		await this.post('room', {roles});
		let room = await this.getJSON();

		console.log('Test invalid room id');
		await this.get('role', {id: 1000, seat: 1});
		await this.assertError(404, 'Room does not exist');

		console.log('Test invalid seat key');
		let seat = 1 + Math.floor(Math.random() * roles.length);
		await this.get('role', {id: room.id, seat});
		await this.assertError(400, 'Invalid seat key');

		let takenSeats = [];
		for (let i = 0; i < roles.length; i++) {
			let seatKey = randstr(32);
			let seat = i + 1;
			console.log('Take seat ' + seat);
			await this.get('role', {id: room.id, seat, seatKey});
			let result = await this.getJSON();
			if (result.role) {
				takenSeats.push(result.role);
			} else {
				assert.fail('No role is found');
			}

			await this.get('role', {id: room.id, seat});
			await this.assertError(400, 'Invalid seat key');

			await this.get('role', {id: room.id, seat, seatKey: seatKey + 1});
			await this.assertError(403, 'Seat has been taken');
		}
		assert.strictEqual(takenSeats.length, roles.length);

		takenSeats.sort();
		for (let i = 0; i < takenSeats.length; i++) {
			assert.strictEqual(roles[i], takenSeats[i]);
		}

		console.log('Delete the room');
		await this.delete('room', {id: room.id});
		await this.assertJSON({id: room.id});
	}

}

module.exports = RoleTest;
