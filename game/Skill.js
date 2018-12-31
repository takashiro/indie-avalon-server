
/**
 * Role Skill
 */
class Skill {

	/**
	 * Skill owner
	 * @param {Timing} timing
	 * @param {Role} role
	 */
	constructor(timing, role) {
		this.timing = timing;
		this.role = role;
	}

	/**
	 * Check if the skill has effect on the player
	 * @param {Engine} engine
	 * @param {Player} player
	 * @return {boolean}
	 */
	onEffect(engine, player) {
		return player && player.role === this.role;
	}

	/**
	 * Add extra information when the role is taken
	 * @param {Engine} engine
	 * @param {Player} player
	 * @param {*} args extra arguments may exist
	 * @return {boolean} Events will be stopped if it returns true
	 */
	effect(engine, player, args = undefined) {
		return {};
	}

}

module.exports = Skill;
