import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);

interface Socket {
	host: string;
	port: number;
}

export default class Config {
	socket: string | number | Socket;

	roomNumLimit: number;

	roomExpiry: number;

	constructor() {
		this.socket = '/var/run/indie-avalon.sock';
		this.roomExpiry = 43200 * 1000;
		this.roomNumLimit = 1000;
	}

	async read(configFile = 'config.json'): Promise<void> {
		if (!fs.existsSync(configFile)) {
			return;
		}

		try {
			const content = await readFile(configFile, 'utf-8');
			const config = JSON.parse(content);
			Object.assign(this, config);
		} catch (error) {
			// Ignore
		}
	}
}
