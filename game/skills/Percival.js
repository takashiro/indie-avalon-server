
const Role = require('../Role');
const Timing = require('../Timing');
const Skill = require('../Skill');

class Percival extends Skill {

	constructor() {
		super(Timing.GameStart, Role.Percival);
	}

	effect(engine, percival, info) {
		let magicians = [];
		for (let [seat, pos] of engine.seats) {
			if (pos.role === Role.Merlin) {
				magicians.push(seat);
				break;
			}
		}

		engine.trigger(Timing.Vision, percival, magicians);
		info.magicians = magicians;
	}

}

module.exports = Percival;
