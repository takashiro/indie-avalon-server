
/**
 * Player
 */
class Player {

	/**
	 * Create a Player instance
	 * @param {Role} role
	 */
	constructor(role) {
		this.role = role;
		this.seatKey = null;
	}

	/**
	 * Get seat key
	 * @return {number}
	 */
	getSeatKey() {
		return this.seatKey;
	}

	/**
	 * Set seat key
	 * @param {number} key
	 */
	setSeatKey(key) {
		this.seatKey = key;
	}

}

module.exports = Player;
