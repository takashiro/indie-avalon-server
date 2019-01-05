
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Lobby = require('../../core/Lobby');
const Room = require('../../core/Room');

function waitTimeout(timeout) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, timeout);
	});
}

class LobbyTest extends UnitTest {

	constructor() {
		super('lobby');
	}

	async run() {
		let lobby = new Lobby(100);
		let room = new Room;

		console.log('Add a room');
		assert(lobby.add(room), 'Failed to add room');
		let roomId = room.id;

		console.log('Get room id');
		assert(roomId, 'Room id is invalid');

		console.log('Confirm room existance');
		assert(lobby.get(roomId) === room, 'Room does not exist');

		console.log('Confirm room expiry');
		await waitTimeout(101);
		assert(!lobby.get(roomId), 'Room does not expire');
	}

}

module.exports = LobbyTest;
