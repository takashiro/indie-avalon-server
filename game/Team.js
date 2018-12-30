
let teamValue = 0;

class Team {

	/**
	 * Create an enumeration of Team
	 * @param {string} key
	 */
	constructor(key) {
		this.key = key;
		this.value = teamValue++;
		Team[key] = this;
	}

	/**
	 * Convert the Team instance into integer
	 */
	toNum() {
		return this.value;
	}

	/**
	 * Convert integer into Team instance
	 * @param {number} value integer value
	 * @return {Team} Corresponing Team instance
	 */
	static fromNum(value) {
		if (0 <= value && value < Team.enums.length) {
			return Team.enums[value];
		} else {
			return Team.Unknown;
		}
	}

}

Team.enums = [
	new Team('Unknown'),

	new Team('Loyal'),
	new Team('Rebel'),
];

module.exports = Team;
