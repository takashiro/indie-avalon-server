
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

	effect(engine, merlin, rebels) {
		for (let i = 0; i < rebels.length; i++) {
			let player = engine.getPlayer(rebels[i]);
			if (player.getRole() === this.role) {
				rebels.splice(i, 1);
				i--;
			}
		}
	}

}

module.exports = Mordred;