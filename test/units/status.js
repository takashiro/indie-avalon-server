
const assert = require('assert');

module.exports = {
	name: 'lobby status',
	run: async function testStatus(client) {
		let status = await client.get('status');
		assert.strictEqual(status.roomNum, 0);
		assert.strictEqual(status.roomNumLimit, 10);
	}
};
