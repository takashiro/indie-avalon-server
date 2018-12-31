
const assert = require('assert');
const read = require('../readStream');

module.exports = {
	name: 'Take seat',
	run: async function testStatus(client) {
		let res;

		console.log('Create a room');
		let roles = [1, 1, 2, 2, 3, 4];
		res = await client.post('room', {roles});
		assert.strictEqual(res.statusCode, 200);

		let room = await read(res);

		console.log('Test invalid room id');
		res = await client.get('role', {id: 1000, seat: 1});
		assert.strictEqual(res.statusCode, 404);

		console.log('Test invalid seatKey');
		let seat = 1 + Math.floor(Math.random() * roles.length);
		res = await client.get('role', {id: room.id, seat});
		assert.strictEqual(res.statusCode, 400);

		let takenSeats = [];
		for (let i = 0; i < roles.length; i++) {
			let seatKey = Math.floor(Math.random() * 0xFFFF);
			let seat = i + 1;
			console.log('Take seat ' + seat);

			res = await client.get('role', {id: room.id, seat, seatKey});
			assert.strictEqual(res.statusCode, 200);

			let result = await read(res);
			if (result.role) {
				takenSeats.push(result.role);
			} else {
				assert.fail('No role is found');
			}

			for (let invalidSeatKey of [undefined, seatKey + 1]) {
				res = await client.get('role', {id: room.id, seat, seatKey: invalidSeatKey});
				if (res.statusCode === 200) {
					result = await read(res);
					if (result.role) {
						assert.fail('Taken seat should not be seen');
					}
				}
			}
		}
		assert.strictEqual(takenSeats.length, roles.length);

		takenSeats.sort();
		for (let i = 0; i < takenSeats.length; i++) {
			assert.strictEqual(roles[i], takenSeats[i]);
		}

		console.log('Delete the room');
		res = await client.delete('room', {id: room.id});
		assert.strictEqual(res.statusCode, 200);
	}
};
