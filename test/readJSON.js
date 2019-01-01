
const readText = require('./readText');

/**
 * Read JSON object from a stream
 * @param {Stream} stream
 * @return {Promise<object>} JSON Object
 */
async function readJSON(stream) {
	let text = await readText(stream);
	return JSON.parse(text);
}

module.exports = readJSON;
