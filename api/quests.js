
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
	const playerNum = engine.getPlayerNum();
	let quests = engine.quests.length > 1 ? engine.quests.slice(0, engine.quests.length - 1) : [];
	return quests.map(quest => ({
		seq: quest.seq,
		leader: quest.leader.seat,
		members: quest.members,
		cards: {
			success: quest.success,
			fail: quest.fail,
		},
		success: quest.isSuccessful(playerNum)
	}));
}

module.exports = {GET};
