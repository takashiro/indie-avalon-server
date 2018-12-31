
const Role = require('../Role');
const Team = require('../Team');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Rebel extends Skill {

	constructor() {
		super(Timing.GameStart, Role.Rebel);
	}

	onEffect(engine, rebel) {
		return rebel && rebel.getTeam() === Team.Rebel;
	}

	effect(engine, rebel, info) {
		let mates = [];
		for (let [seat, player] of engine.seats) {
			if (seat !== rebel.seat && player.getTeam() === Team.Rebel) {
				mates.push(seat);
			}
		}

		engine.trigger(Timing.Vision, rebel, mates);
		info.mates = mates;
	}

}

module.exports = Rebel;
