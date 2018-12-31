
const Role = require('../Role');
const Team = require('../Team');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Minion extends Skill {

	constructor() {
		super(Timing.GameStart, Role.Minion);
	}

	onEffect(engine, minion) {
		return minion && minion.getTeam() === Team.Minion;
	}

	effect(engine, minion, info) {
		let mates = [];
		for (let [seat, player] of engine.seats) {
			if (seat !== minion.seat && player.getTeam() === Team.Minion) {
				mates.push(seat);
			}
		}

		engine.trigger(Timing.Vision, minion, mates);
		info.mates = mates;
	}

}

module.exports = Minion;
