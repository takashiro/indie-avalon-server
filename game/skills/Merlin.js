
const Role = require('../Role');
const Team = require('../Team');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Merlin extends Skill {

	constructor() {
		super(Timing.GameStart, Role.Merlin);
	}

	effect(engine, merlin, info) {
		let rebels = [];
		for (let [seat, player] of engine.seats) {
			if (player.getTeam() === Team.Rebel) {
				rebels.push(seat);
			}
		}

		engine.trigger(Timing.Vision, merlin, rebels);
		info.rebels = rebels;
	}

}

module.exports = Merlin;
