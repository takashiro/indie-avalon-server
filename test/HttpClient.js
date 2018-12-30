
const http = require('http');
const querystring = require('querystring');

function request(method, api, params, data) {
	let path = '/' + api;
	if (params) {
		path += '?' + querystring.stringify(params);
	}
	let port = this.port;

	return new Promise(function (resolve, reject) {
		let request = http.request({
			method: method,
			port: port,
			path: path,
		}, function (res) {
			if (res) {
				resolve(res);
			} else {
				reject();
			}
		});

		request.on('error', reject);

		request.end(data && JSON.stringify(data));
	});
}

function read(res) {
	return new Promise(function (resolve, reject) {
		let body = [];
		res.on('data', chunk => body.push(chunk));
		res.on('error', reject);
		res.on('end', function () {
			let json = Buffer.concat(body).toString();
			try {
				resolve(JSON.parse(json));
			} catch (error) {
				reject(error);
			}
		});
	});
}

class HttpClient {

	constructor(port) {
		this.port = port;
	}

	post(api, params, data) {
		return this.request('POST', api, params, data);
	}

	get(api, params) {
		return this.request('GET', api, params);
	}

	delete(api, params) {
		return this.request('DELETE', api, params);
	}

	async request(method, api, params, data) {
		let res = await request.call(this, method, api, params, data);
		return read(res);
	}
}

module.exports = HttpClient;
