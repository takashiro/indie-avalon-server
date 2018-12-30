
const fs = require('fs');
const util = require('util');
const readline = require('readline');
const {spawn} = require('child_process');

const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

const HttpClient = require('./test/HttpClient');

const config = {
	socket: {port: 10000 + Math.floor(Math.random() * 55536)},
	maxRoomLimit: 10
};

(async function () {
	// Write config file
	const configFile = 'test/tmp/config.json';
	await writeFile(configFile, JSON.stringify(config));

	// Start application
	const app = spawn('node', ['app', '--config=' + configFile]);
	await new Promise(function (resolve, reject) {
		const appout = readline.createInterface({input: app.stdout});
		appout.once('line', function (message) {
			if (message === 'started') {
				resolve();
			} else {
				reject();
			}
		});
		const apperr = readline.createInterface({input: app.stderr});
		apperr.once('line', reject);
	});

	// Run tests
	const client = new HttpClient(config.socket.port);
	const tests = require('./test/units');

	let failures = 0;
	for (let test of tests) {
		console.log(`Testing ${test.name}...`);
		try {
			await test.run(client);
		} catch (error) {
			console.error(error);
			failures++;
		}
	}

	console.log(`Result: ${tests.length - failures} / ${tests.length}`);

	// Close application
	app.kill();

	return process.exit(failures ? 1 : 0);
})();
