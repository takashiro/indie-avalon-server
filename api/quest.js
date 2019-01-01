
const HttpError = require('../core/HttpError');
const Quest = require('../game/Quest');

function POST(params, input) {
	let id = parseInt(params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	const lobby = this.getLobby();
	const room = lobby.get(id);
	if (!room) {
		throw new HttpError(404, 'The room does not exist');
	}

	const engine = room.getEngine();
	if (input.members) {
		let seat = parseInt(input.seat, 10);
		if (isNaN(seat) || seat <= 0) {
			throw new HttpError(400, 'Invalid leader seat number');
		}

		let leader = engine.getPlayer(seat);
		if (!leader) {
			throw new HttpError(400, 'Leader seat number does not exist');
		}
		if (leader.getSeatKey() !== input.seatKey) {
			throw new HttpError(403, 'Invalid leader seat key');
		}

		let members = input.members;
		if (!(members instanceof Array)) {
			throw new HttpError(400, '`members` must be an array of integers');
		}
		for (let member of members) {
			if (!engine.getPlayer(member)) {
				throw new HttpError(400, 'The seat number does not exist');
			}
		}

		let seq = engine.quests.length + 1;
		let questMemberNum = Quest.getMemberNum(engine.getPlayerNum(), seq);
		if (questMemberNum !== members.length) {
			throw new HttpError(400, 'The quest accepts ' + questMemberNum + ' members');
		}

		let currentQuest = engine.currentQuest;
		if (currentQuest && currentQuest.progress < currentQuest.progressLimit) {
			throw new HttpError(400, 'A quest is still on going');
		}

		let quest = new Quest(seq, leader, members);
		engine.addQuest(quest);
		return {seq: quest.seq};

	} else if (input.questCard !== undefined) {
		let seat = parseInt(input.seat, 10);
		let seatKey = input.seatKey;
		if (isNaN(seat) || seat <= 0 || !seatKey) {
			throw new HttpError(400, 'Seat and seat key is required to complete a quest');
		}

		let player = engine.getPlayer(seat);
		if (!player) {
			throw new HttpError(400, 'Invalid seat number');
		}
		if (player.getSeatKey() !== seatKey) {
			throw new HttpError(403, 'Incorrect seat key');
		}

		let quest = engine.currentQuest;
		if (quest.members.indexOf(seat) < 0) {
			throw new HttpError(403, 'Not a quest member');
		}

		let questCard = !!input.questCard;
		if (quest.join(seat, questCard)) {
			return {seq: quest.seq, questCard};
		} else {
			return {seq: quest.seq};
		}
	}
}

function GET(params) {
	let id = parseInt(params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	const lobby = this.getLobby();
	const room = lobby.get(id);
	if (!room) {
		throw new HttpError(404, 'The room does not exist');
	}

	const engine = room.getEngine();
	const quest = engine.currentQuest;
	if (!quest) {
		throw new HttpError(404, 'No quest exists');
	}

	return {
		seq: quest.seq,
		leader: quest.leader.seat,
		members: quest.members,
		cards: {
			success: quest.success,
			fail: quest.fail,
		},
		success: quest.isSuccessful(engine.getPlayerNum())
	};
}

module.exports = {GET, POST};
