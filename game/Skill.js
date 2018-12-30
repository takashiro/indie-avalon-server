
/**
 * Role Skill
 */
class Skill {

	/**
	 * Skill owner
	 * @param {Role} role
	 */
	constructor(role) {
		this.role = role;
	}

	/**
	 * Add extra information when the role is taken
	 * @param {Engine} engine
	 */
	effect(engine) {
		return {};
	}

}

module.exports = Skill;
