

const assert = require('assert');

const read = require('../readStream');

module.exports = {
	name: 'create/enter/delete room',
	run: async function testStatus(client) {
		let res;
		let status1 = await read(await client.get('status'));

		console.log('Create a room');
		let roles = [1, 2, 3, 4, 5];
		res = await client.post('room', {roles});
		assert.strictEqual(res.statusCode, 200);

		let room = await read(res);
		assert.strictEqual(room.roles.length, roles.length);

		console.log('Check lobby status');
		let status2 = await read(await client.get('status'));
		assert.strictEqual(status1.roomNum + 1, status2.roomNum);

		console.log('Check roles');
		for (let role of room.roles) {
			assert(roles.indexOf(role) >= 0, 'Check roles');
		}

		console.log('Delete a room');
		res = await client.delete('room', {id: room.id});
		assert.strictEqual(res.statusCode, 200);

		let deleted = await read(res);
		assert.strictEqual(room.id, deleted.id);
	}
};
