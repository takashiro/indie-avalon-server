
/**
 * Read JSON object from a stream
 * @param {Stream} stream
 * @return {Promise<object>} JSON Object
 */
function readStream(stream) {
	return new Promise(function (resolve, reject) {
		let body = [];
		stream.on('data', chunk => body.push(chunk));
		stream.on('error', reject);
		stream.on('end', function () {
			let json = Buffer.concat(body).toString();
			try {
				resolve(JSON.parse(json));
			} catch (error) {
				console.error('Failed to parse: ' + json);
				reject(error);
			}
		});
	});
}

module.exports = readStream;
