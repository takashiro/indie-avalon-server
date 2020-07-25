import {
	Router,
	Request,
	Response,
} from 'express';

import { lobby } from '../../core';
import GameDriver from '../../driver/GameDriver';

const router = Router({ mergeParams: true });

router.post('/:seat', (req: Request, res: Response): void => {
	const id = parseInt(req.params.id, 10);
	if (Number.isNaN(id) || id <= 0) {
		res.status(400).send('Invalid room id');
		return;
	}

	const room = lobby.get(id);
	if (!room) {
		res.status(404).send('Room does not exist');
		return;
	}

	const driver = room.getDriver();
	if (!driver || !(driver instanceof GameDriver)) {
		res.status(500).send('Game engine is not loaded');
		return;
	}

	const seat = parseInt(req.params.seat, 10);
	if (!driver.hasSeat(seat)) {
		res.status(404).send('Seat does not exist');
		return;
	}

	const { seatKey } = req.body;
	if (!seatKey || typeof seatKey !== 'string') {
		res.status(400).send('Invalid seat key');
		return;
	}

	const vision = driver.takeSeat(seat, seatKey);
	if (!vision) {
		res.status(403).send('Seat has been taken');
		return;
	}

	res.json({
		role: vision.role,
		others: vision.others,
	});
});

export default router;
