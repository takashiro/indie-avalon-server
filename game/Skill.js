
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
	 * Add extra information when the role is taken
	 * @param {Engine} engine
	 * @param {*} args extra arguments may exist
	 * @return {boolean} Events will be stopped if it returns true
	 */
	effect(engine, args = undefined) {
		return {};
	}

}

module.exports = Skill;
