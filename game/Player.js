
/**
 * Player
 */
class Player {

	/**
	 * Create a Player instance
	 * @param {number} seat
	 * @param {Role} role
	 */
	constructor(seat, role) {
		this.seat = seat;
		this.seatKey = null;
		this.role = role;
	}

	/**
	 * Get role
	 * @return {Role}
	 */
	getRole() {
		return this.role;
	}

	/**
	 * Set role
	 * @param {Role} role
	 */
	setRole(role) {
		this.role = role;
	}

	/**
	 * Get team
	 * @return {Team}
	 */
	getTeam() {
		return this.role.team;
	}

	/**
	 * Get seat number
	 * @return {number}
	 */
	getSeat() {
		return this.seat;
	}

	/**
	 * Set seat number
	 * @param {number} seat
	 */
	setSeat(seat) {
		this.seat = seat;
	}

	/**
	 * Get seat key
	 * @return {string}
	 */
	getSeatKey() {
		return this.seatKey;
	}

	/**
	 * Set seat key
	 * @param {string} key
	 */
	setSeatKey(key) {
		this.seatKey = key;
	}

}

module.exports = Player;
