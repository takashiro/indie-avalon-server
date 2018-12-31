
const Role = require('../Role');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Mordred extends Skill {

	constructor() {
		super(Timing.Vision, Role.Mordred);
	}

	onEffect(engine, target) {
		return target && target.getRole() === Role.Merlin;
	}

	effect(engine, merlin, minions) {
		for (let i = 0; i < minions.length; i++) {
			let player = engine.getPlayer(minions[i]);
			if (player.getRole() === this.role) {
				minions.splice(i, 1);
				i--;
			}
		}
	}

}

module.exports = Mordred;
