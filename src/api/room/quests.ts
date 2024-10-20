import {
	Router,
	Request,
	Response,
} from 'express';

import GameDriver from '../../driver/GameDriver.js';

import { getRoom } from './utils.js';

const router = Router({
	mergeParams: true,
});

router.get('/', (req: Request, res: Response): void => {
	const room = getRoom(req, res);
	if (!room) {
		return;
	}

	const driver = room.getDriver();
	if (!driver || !(driver instanceof GameDriver)) {
		res.status(500).send('Driver is not loaded yet.');
		return;
	}

	const quests = driver.getQuests();
	res.json(quests.map((quest) => quest.toJSON()));
});

export default router;
