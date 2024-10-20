import {
	Router,
	Request,
	Response,
} from 'express';

import GameDriver from '../../driver/GameDriver.js';
import Player from '../../driver/Player.js';

import { getRoom } from './utils.js';

const router = Router({
	mergeParams: true,
});

router.post('/', (req: Request, res: Response): void => {
	const room = getRoom(req, res);
	if (!room) {
		return;
	}

	const driver = room.getDriver();
	if (!driver || !(driver instanceof GameDriver)) {
		res.status(500).send('Driver is not loaded');
		return;
	}

	if (req.body.members) {
		const leaderSeat = parseInt(req.body.seat, 10);
		if (Number.isNaN(leaderSeat) || leaderSeat <= 0) {
			res.status(400).send('Invalid leader seat number');
			return;
		}

		const leader = driver.getPlayer(leaderSeat);
		if (!leader) {
			res.status(400).send('Leader seat number does not exist');
			return;
		}

		if (!leader.getSeatKey() || leader.getSeatKey() !== req.body.seatKey) {
			res.status(403).send('Invalid leader seat key');
			return;
		}

		const memberSeats = req.body.members;
		if (!(memberSeats instanceof Array)) {
			res.status(400).send('`members` must be an array of integers');
			return;
		}

		const members: Player[] = [];
		for (const seat of memberSeats) {
			const member = driver.getPlayer(seat);
			if (!member) {
				res.status(400).send('The seat number does not exist');
				return;
			}
			members.push(member);
		}

		const curQuest = driver.getCurrentQuest();
		if (curQuest && curQuest.isOngoing()) {
			res.status(400).send('A quest is still on going');
			return;
		}

		const quest = driver.addQuest(leader, members);
		if (!quest) {
			res.status(400).send('Invalid number of members');
			return;
		}

		res.json({ seq: quest.getSeq() });
	} else if (req.body.questCard !== undefined) {
		const seat = Number.parseInt(req.body.seat, 10);
		const { seatKey } = req.body;
		if (Number.isNaN(seat) || seat <= 0 || !seatKey) {
			res.status(400).send('Seat and seat key is required to complete a quest');
			return;
		}

		const member = driver.getPlayer(seat);
		if (!member) {
			res.status(400).send('Invalid seat number');
			return;
		}
		if (member.getSeatKey() !== seatKey) {
			res.status(403).send('Incorrect seat key');
			return;
		}

		const quest = driver.getCurrentQuest();
		if (!quest) {
			res.status(404).send('No quest is created yet.');
			return;
		}

		if (!quest.hasMember(member)) {
			res.status(403).send('Not a quest member');
			return;
		}

		const questCard = Boolean(req.body.questCard);
		if (quest.join(member, questCard)) {
			res.json({
				seq: quest.getSeq(),
				questCard,
			});
		} else {
			res.json({
				seq: quest.getSeq(),
			});
		}
	}
});

router.get('/:seq?', (req: Request, res: Response): void => {
	const room = getRoom(req, res);
	if (!room) {
		return;
	}

	const driver = room.getDriver();
	if (!driver || !(driver instanceof GameDriver)) {
		res.status(500).send('Driver is not loaded.');
		return;
	}

	const seq = Number.parseInt(req.params.seq, 10);
	const quest = Number.isNaN(seq) ? driver.getCurrentQuest() : driver.getQuest(seq);
	if (!quest) {
		res.status(404).send('No quest exists');
		return;
	}

	res.json(quest.toJSON());
});

export default router;
