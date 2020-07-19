import {
	app,
	lobby,
	config,
} from './core';

import router from './api';

(async function main(): Promise<void> {
	await config.read();

	lobby.setRoomNumLimit(config.roomNumLimit);
	lobby.setRoomExpiry(config.roomExpiry);

	for (const [context, handler] of router) {
		app.use(`/${context}`, handler);
	}
	app.listen(config.socket);
}());
