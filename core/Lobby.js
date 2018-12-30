
/**
 * Room Manager
 */
class Lobby {

	constructor(roomNumLimit = 1000) {
		this.roomNumLimit = roomNumLimit;
		this.rooms = new Map;
	}

	getStatus() {
		return {
			roomNum: this.rooms.size,
			roomNumLimit: this.roomNumLimit,
		};
	}

}

module.exports = Lobby;
