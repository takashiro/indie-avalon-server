
const assert = require('assert');

const read = require('../readStream');

module.exports = {
	name: 'lobby status',
	run: async function testStatus(client) {
		let res = await client.get('status');
		assert.strictEqual(res.statusCode, 200);

		let status = await read(res);
		assert.strictEqual(status.roomNum, 0);
		assert.strictEqual(status.roomNumLimit, 10);
	}
};
