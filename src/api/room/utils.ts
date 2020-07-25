import {
	Request,
	Response,
} from 'express';

import { lobby } from '../../core';
import Room from '../../core/Room';

/* eslint-disable import/prefer-default-export */
export function getRoom(req: Request, res: Response): Room | null {
	const id = parseInt(req.params.id, 10);
	if (Number.isNaN(id) || id <= 0) {
		res.status(400).send('Invalid room id');
		return null;
	}

	const room = lobby.get(id);
	if (!room) {
		res.status(404).send('The room does not exist');
		return null;
	}

	return room;
}
