
const assert = require('assert');
const UnitTest = require('../UnitTest');

class StatusTest extends UnitTest {

	constructor() {
		super('lobby status');
	}

	async run() {
		await this.get('status');
		await this.getJSON({
			roomNum: 0,
			roomNumLimit: 10,
		});
	}

}

module.exports = StatusTest;
