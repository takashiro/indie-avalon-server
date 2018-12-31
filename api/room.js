
const HttpError = require('../core/HttpError');

const Room = require('../core/Room');
const Role = require('../game/Role');
const GameEngine = require('../game/Engine');

function POST(params, input) {
	if (!input.roles || !(input.roles instanceof Array)) {
		throw new HttpError(400, 'Please select roles');
	}

	if (input.roles.length > 50) {
		throw new HttpError(400, 'Too many roles');
	}

	let roles = input.roles.map(Role.fromNum).filter(role => role != Role.Unknown);
	if (roles.length <= 0) {
		throw new HttpError(400, 'All roles are invalid');
	}

	let lobby = this.getLobby();
	if (!lobby.isAvailable()) {
		throw new HttpError(500, 'Too many rooms');
	}

	let room = new Room;
	if (!lobby.add(room)) {
		throw new HttpError(500, 'Too many rooms');
	}

	let engine = new GameEngine;
	room.setEngine(engine);
	engine.setRoles(roles);
	engine.start();

	return {
		id: room.id,
		ownerKey: room.ownerKey,
		roles: engine.roles.map(role => role.toNum()),
		questLeader: engine.questLeader,
	};
}

function GET(params) {
	let id = parseInt(params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	let lobby = this.getLobby();
	let room = lobby.get(id);
	if (!room) {
		throw new HttpError(404, 'The room does not exist');
	}

	let engine = room.getEngine();

	return {
		id: room.id,
		roles: engine.roles.map(role => role.toNum()),
	};
}

function DELETE(params) {
	let id = parseInt(params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	let lobby = this.getLobby();
	if (!lobby.remove(id)) {
		throw new HttpError(404, 'The room does not exist');
	}

	return {id};
}

module.exports = {
	POST,
	GET,
	DELETE,
};
