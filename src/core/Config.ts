import fs from 'fs';
import fsp from 'fs/promises';

interface Socket {
	host: string;
	port: number;
}

interface AppConfig {
	socket: string | number | Socket;

	roomNumLimit: number;

	roomExpiry: number;
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
			const content = await fsp.readFile(configFile, 'utf-8');
			const config = JSON.parse(content) as AppConfig;
			Object.assign(this, config);
		} catch (ignore) {
			// Ignore
		}
	}
}
