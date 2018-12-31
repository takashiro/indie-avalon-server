
const Role = require('../Role');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Morgana extends Skill {

	constructor() {
		super(Timing.Vision, Role.Morgana);
	}

	onEffect(engine, player) {
		return player.role === Role.Percival;
	}

	effect(engine, percival, magicians) {
		for (let [seat, pos] of engine.seats) {
			if (pos.role === this.role) {
				magicians.push(seat);
			}
		}
	}

}

module.exports = Morgana;
