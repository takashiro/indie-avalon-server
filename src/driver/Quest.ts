import Player from './Player';

const QUEST_PLAN = [
	null, null, null, null, null, // [0, 4] Invalid numbers of players
	[2, 3, 2, 3, 3],
	[2, 3, 4, 3, 4],
	[2, 3, 3, 4, 4],
	[3, 4, 4, 5, 5],
];

interface QuestData {
	seq: number;
	leader: number;
	members: number[];
	successNum: number;
	failureNum: number;
	successful: boolean;
}

export default class Quest {
	protected playerNum: number;

	protected seq: number;

	protected leader: Player;

	protected members: Player[];

	protected successNum: number;

	protected failureNum: number;

	protected completed: Player[];

	/**
	 * Create a quest
	 * @param playerNum Total number of players
	 * @param seq sequence of the quest
	 * @param leader seat number of the leader
	 * @param members seat number of quest members
	 */
	constructor(playerNum: number, seq: number, leader: Player, members: Player[]) {
		this.playerNum = playerNum;
		this.seq = seq;
		this.leader = leader;
		this.members = members;
		this.successNum = 0;
		this.failureNum = 0;
		this.completed = [];
	}

	getSeq() {
		return this.seq;
	}

	getLeader(): Player {
		return this.leader;
	}

	getMembers(): Player[] {
		return this.members;
	}

	hasMember(member: Player): boolean {
		return this.members.includes(member);
	}

	getSuccessNum(): number {
		return this.successNum;
	}

	getFailureNum(): number {
		return this.failureNum;
	}

	/**
	 * @return The number of members who have completed the quest
	 */
	get progress(): number {
		return this.successNum + this.failureNum;
	}

	/**
	 * @return The total number of members
	 */
	get progressLimit() {
		return this.members.length;
	}

	isOngoing(): boolean {
		return this.progress < this.progressLimit;
	}

	/**
	 * Join the quest and choose success or failure
	 * @param player
	 * @param success
	 * @return returns false if the member isn't permitted or has already completed before
	 */
	join(player: Player, success: boolean): boolean {
		if (!this.members.includes(player)) {
			return false;
		}

		if (this.completed.includes(player)) {
			return false;
		}

		this.completed.push(player);
		if (success) {
			this.successNum++;
		} else {
			this.failureNum++;
		}

		return true;
	}

	/**
	 * Check if the quest is successful
	 */
	isSuccessful(): boolean {
		if (this.progress < this.progressLimit) {
			return false;
		}

		if (this.isProtected()) {
			return this.failureNum < 2;
		}
		return this.failureNum < 1;
	}

	/**
	 * @return Check if this is a protected quest
	 */
	isProtected(): boolean {
		if (this.playerNum < 7) {
			return false;
		}
		return this.seq == 4;
	}

	/**
	 * Check whether the quest is valid.
	 * If the number of members doesn't match, it returns false.
	 */
	isValid(): boolean {
		const plan = this.playerNum < QUEST_PLAN.length ? QUEST_PLAN[this.playerNum] : QUEST_PLAN[QUEST_PLAN.length - 1];
		if (plan) {
			return plan[this.seq - 1] === this.members.length;
		}
		return false;
	}

	toJSON(): QuestData {
		return {
			seq: this.getSeq(),
			leader: this.getLeader().getSeat(),
			members: this.getMembers().map((member) => member.getSeat()),
			successNum: this.getSuccessNum(),
			failureNum: this.getFailureNum(),
			successful: this.isSuccessful(),
		};
	}
}
