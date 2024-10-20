import {
	Router,
	Request,
	Response,
} from 'express';
import { Role } from '@karuta/avalon-core';

import { lobby } from '../../core/index.js';
import Room from '../../core/Room.js';
import GameDriver from '../../driver/GameDriver.js';

import { getRoom } from './utils.js';

import seatRouter from './seat.js';
import questRouter from './quest.js';
import questsRouter from './quests.js';

const router = Router();

router.use('/:id/seat', seatRouter);
router.use('/:id/quest', questRouter);
router.use('/:id/quests', questsRouter);

router.post('/', (req: Request, res: Response): void => {
	let { roles } = req.body;
	if (!roles || !(roles instanceof Array)) {
		res.status(400).send('Please select roles.');
		return;
	}

	if (roles.length > 50) {
		res.status(400).send('Too many roles');
		return;
	}

	roles = roles.filter((role) => Role.Unknown < role && role < Role.MaxLimit);
	if (roles.length <= 0) {
		res.status(400).send('All roles are invalid');
		return;
	}

	if (!lobby.isAvailable()) {
		res.status(500).send('Too many rooms');
		return;
	}

	const room = new Room();
	if (!lobby.add(room)) {
		res.status(500).send('Too many rooms');
		return;
	}

	const driver = new GameDriver();
	room.setDriver(driver);
	driver.setRoles(roles);
	driver.start();

	res.json({
		id: room.getId(),
		ownerKey: room.getOwnerKey(),
		roles: driver.getRoles(),
		questLeader: driver.getQuestLeader(),
	});
});

router.get('/:id', (req: Request, res: Response): void => {
	const room = getRoom(req, res);
	if (!room) {
		return;
	}

	const driver = room.getDriver() as GameDriver;
	res.json({
		id: room.getId(),
		roles: driver.getRoles(),
	});
});

router.delete('/:id', (req: Request, res: Response): void => {
	const id = parseInt(req.params.id, 10);
	if (Number.isNaN(id) || id <= 0) {
		res.status(400).send('Invalid room id');
		return;
	}

	const room = lobby.get(id);
	if (!room) {
		res.status(404).send('The room does not exist');
		return;
	}

	if (room.getOwnerKey() !== req.query.ownerKey) {
		res.sendStatus(403);
		return;
	}

	lobby.remove(id);

	res.json({ id });
});

export default router;
