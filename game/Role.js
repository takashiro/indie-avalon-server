
const Team = require('./Team');

let roleValue = 0;

class Role {

	/**
	 * Create an enumeration of Role
	 * @param {string} key
	 * @param {Team} team
	 */
	constructor(key, team) {
		this.key = key;
		this.value = roleValue++;
		this.team = team;
		Role[key] = this;
	}

	/**
	 * Convert the Team instance into integer
	 */
	toNum() {
		return this.value;
	}

	/**
	 * Convert integer into Role instance
	 * @param {number} value integer value
	 * @return {Role} Corresponing Role instance
	 */
	static fromNum(value) {
		if (0 <= value && value < Role.enums.length) {
			return Role.enums[value];
		} else {
			return Role.Unknown;
		}
	}

}

Role.enums = [
	new Role('Unknown', Team.Unknown),

	new Role('Loyal', Team.Loyal),
	new Role('Rebel', Team.Rebel),

	new Role('Merlin', Team.Loyal),
	new Role('Assassin', Team.Rebel),

	new Role('Percival', Team.Loyal),
	new Role('Morgana', Team.Rebel),

	new Role('Oberon', Team.Rebel),
	new Role('Mordred', Team.Rebel),

	new Role('BlueLancelot', Team.Loyal),
	new Role('RedLancelot', Team.Rebel),
];

module.exports = Role;
