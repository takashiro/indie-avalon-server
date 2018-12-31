
const Role = require('../Role');
const Team = require('../Team');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Oberon extends Skill {

	constructor() {
		super(Timing.Vision, Role.Oberon);
	}

	onEffect(engine, minion) {
		return minion && minion.getTeam() === Team.Minion;
	}

	effect(engine, minion, mates) {
		if (minion.getRole() === this.role) {
			mates.splice(0, mates.length);
		} else {
			for (let i = 0; i < mates.length; i++) {
				let seat = mates[i];
				let player = engine.getPlayer(seat);
				if (player.getRole() === this.role) {
					mates.splice(i, 1);
					i--;
				}
			}
		}
	}

}

module.exports = Oberon;
