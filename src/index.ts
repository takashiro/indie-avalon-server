import {
	lobby,
	config,
} from './core';
import app from './app';

(async function main(): Promise<void> {
	await config.read();

	lobby.setRoomNumLimit(config.roomNumLimit);
	lobby.setRoomExpiry(config.roomExpiry);
	app.listen(config.socket);
}());
