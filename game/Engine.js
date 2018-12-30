
const shuffle = require('../util/shuffle');

// Load skills
const SkillMap = new Map;
for (let Skill of require('./skills')) {
	let skill = new Skill;
	SkillMap.set(skill.role, skill);
}

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

		if (info.seatKey === null) {
			info.seatKey = seatKey;
			return info.role;
		} else if (info.seatKey === seatKey) {
			return info.role;
		}

		return null;
	}

	/**
	 * Invoke corresponding role skills
	 * @param {Role} role
	 * @return {object|undefined}
	 */
	invokeSkill(role) {
		let skill = SkillMap.get(role);
		return skill && skill.effect(this);
	}

}

module.exports = Engine;
