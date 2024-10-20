import {
	lobby,
	config,
} from './core/index.js';
import app from './app.js';

(async function main(): Promise<void> {
	await config.read();

	lobby.setRoomNumLimit(config.roomNumLimit);
	lobby.setRoomExpiry(config.roomExpiry);
	app.listen(config.socket);
}());
