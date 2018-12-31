
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

	new Role('Servant', Team.Servant),
	new Role('Minion', Team.Minion),

	new Role('Merlin', Team.Servant),
	new Role('Assassin', Team.Minion),

	new Role('Percival', Team.Servant),
	new Role('Morgana', Team.Minion),

	new Role('Oberon', Team.Minion),
	new Role('Mordred', Team.Minion),

	new Role('BlueLancelot', Team.Servant),
	new Role('RedLancelot', Team.Minion),
];

module.exports = Role;
