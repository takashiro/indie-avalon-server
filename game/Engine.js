
const shuffle = require('../util/shuffle');

const Timing = require('./Timing');
const SkillList = require('./skills');

/**
 * Game Engine
 */
class Engine {

	/**
	 * Create a game engine
	 */
	constructor() {
		this.roles = [];
		this.seats = new Map;
		this.playerNum = 0;
	}

	/**
	 * Set the number of players
	 * @param {number} num
	 */
	setPlayerNum(num) {
		this.playerNum = num;
	}

	/**
	 * Set up roles
	 * @param {Role[]} roles
	 */
	setRoles(roles) {
		this.roles = roles;
		this.playerNum = roles.length;
	}

	/**
	 * Arrange roles
	 */
	arrangeRoles() {
		let roles = [...this.roles];
		shuffle(roles);

		for (let seat = 1; seat <= this.playerNum; seat++) {
			this.seats.set(seat, {
				role: roles[seat - 1],
				seatKey: null,
			});
		}
	}

	/**
	 * Check if the seat exists
	 * @param {*} seat
	 * @return {boolean}
	 */
	hasSeat(seat) {
		return this.seats.has(seat);
	}

	/**
	 * Take one seat
	 * @param {number} seat seat number
	 * @param {number} seatKey seat key
	 * @return {Role} if the seat hasn't been take, return the role.
	 */
	takeSeat(seat, seatKey) {
		let info = this.seats.get(seat);
		if (!info) {
			return null;
		}

		let result = {role: undefined};
		if (info.seatKey === null) {
			info.seatKey = seatKey;
			result.role = info.role;
		} else if (info.seatKey === seatKey) {
			result.role = info.role;
		}

		if (result.role) {
			this.trigger(Timing.GameStart, result.role, result);
			result.role = result.role.toNum();
		}

		return result;
	}

	/**
	 * Invoke corresponding role skills
	 * @param {Timing} timing
	 * @param {Role} role
	 * @param {*} extra
	 */
	trigger(timing, role, extra) {
		for (let skill of SkillList) {
			if (skill.timing !== timing || skill.role !== role) {
				continue;
			}

			if (skill.effect(this, extra)) {
				break;
			}
		}
	}

}

module.exports = Engine;
