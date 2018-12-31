
const Role = require('../Role');
const Team = require('../Team');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Merlin extends Skill {

	constructor() {
		super(Timing.GameStart, Role.Merlin);
	}

	effect(engine, info) {
		let rebels = [];
		for (let [seat, pos] of engine.seats) {
			if (pos.role.team === Team.Rebel) {
				rebels.push(seat);
			}
		}

		engine.trigger(Timing.MerlinForecast, rebels);
		info.rebels = rebels;
	}

}

module.exports = Merlin;
