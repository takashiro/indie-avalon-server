
const HttpError = require('../core/HttpError');

function GET(params) {
	let id = parseInt(params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	let lobby = this.getLobby();
	let room = lobby.get(id);
	if (!room) {
		throw new HttpError(404, 'Room does not exist');
	}

	let engine = room.getEngine();
	if (!engine) {
		throw new HttpError(500, 'Game engine is not loaded');
	}

	let seat = parseInt(params.seat, 10);
	if (!engine.hasSeat(seat)) {
		throw new HttpError(404, 'Seat does not exist');
	}

	let seatKey = params.seatKey;
	if (!seatKey) {
		throw new HttpError(400, 'Invalid seat key');
	}

	let taken = engine.takeSeat(seat, seatKey);
	if (!taken.role) {
		throw new HttpError(403, 'Seat has been taken');
	}
	return taken;
}

module.exports = {GET};
