
const assert = require('assert');

const read = require('../readJSON');
const UnitTest = require('../UnitTest');

class StatusTest extends UnitTest {

	constructor() {
		super('lobby status');
	}

	async run(client) {
		let res = await client.get('status');
		assert.strictEqual(res.statusCode, 200);

		let status = await read(res);
		assert.strictEqual(status.roomNum, 0);
		assert.strictEqual(status.roomNumLimit, 10);
	}

}

module.exports = StatusTest;
