
const QUEST_PLAN = [
	null, null, null, null, null, // [0, 4] Invalid numbers of players
	[2, 3, 2, 3, 3],
	[2, 3, 4, 3, 4],
	[2, 3, 3, 4, 4],
	[3, 4, 4, 5, 5],
];

/**
 * Quest
 */
class Quest {

	/**
	 * Create a quest
	 * @param {number} seq sequence of the quest
	 * @param {number} leader seat number of the leader
	 * @param {number[]} members seat number of quest members
	 */
	constructor(seq, leader, members) {
		this.seq = seq;
		this.leader = leader;
		this.members = members;
		this.success = 0;
		this.fail = 0;
		this.completed = [];
	}

	/**
	 * The number of members who have completed the quest
	 * @return {number}
	 */
	get progress() {
		return this.success + this.fail;
	}

	/**
	 * The total number of members
	 * @return {number}
	 */
	get progressLimit() {
		return this.members.length;
	}

	/**
	 * Join the quest and choose success or failure
	 * @param {number} seat
	 * @param {boolean} success
	 * @return {boolean} returns false if the member isn't permitted or has already completed before
	 */
	join(seat, success) {
		if (this.members.indexOf(seat) < 0) {
			return false;
		}

		if (this.completed.indexOf(seat) >= 0) {
			return false;
		}

		this.completed.push(seat);
		if (success) {
			this.success++;
		} else {
			this.fail++;
		}

		return true;
	}

	/**
	 * Check if the quest is successful
	 * @param {number} playerNum
	 */
	isSuccessful(playerNum) {
		if (this.progress < this.progressLimit) {
			return false;
		}

		if (this.isProtected(playerNum)) {
			return this.fail < 2;
		} else {
			return this.fail < 1;
		}
	}

	/**
	 * Check if this is a protected quest
	 * @param {number} playerNum the number of players
	 * @return {boolean}
	 */
	isProtected(playerNum) {
		if (playerNum < 7) {
			return false;
		}

		return this.seq == 4;
	}

	/**
	 * Get the number of members for a quest
	 * @param {number} playerNum the number of players
	 * @param {number} seq the sequence of quest
	 * @return {number} the number of quest members
	 */
	static getMemberNum(playerNum, seq) {
		let plan = playerNum < QUEST_PLAN.length ? QUEST_PLAN[playerNum] : QUEST_PLAN[QUEST_PLAN.length - 1];
		if (plan) {
			return plan[seq - 1];
		} else {
			return 0;
		}
	}

}

module.exports = Quest;
