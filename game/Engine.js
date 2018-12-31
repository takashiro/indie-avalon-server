
const shuffle = require('../util/shuffle');

const Timing = require('./Timing');
const SkillList = require('./skills');
const Player = require('./Player');

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
			this.seats.set(seat, new Player(roles[seat - 1]));
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
		let player = this.seats.get(seat);
		if (!player) {
			return null;
		}

		let result = {role: undefined};
		if (player.getSeatKey() === null) {
			player.setSeatKey(seatKey);
			result.role = player.role;
		} else if (player.getSeatKey() === seatKey) {
			result.role = player.role;
		}

		if (result.role) {
			this.trigger(Timing.GameStart, player, result);
			result.role = result.role.toNum();
		}

		return result;
	}

	/**
	 * Invoke corresponding role skills
	 * @param {Timing} timing
	 * @param {Player} player
	 * @param {*} extra
	 */
	trigger(timing, player, extra) {
		for (let skill of SkillList) {
			if (skill.timing !== timing || !skill.onEffect(this, player)) {
				continue;
			}

			if (skill.effect(this, player, extra)) {
				break;
			}
		}
	}

}

module.exports = Engine;
