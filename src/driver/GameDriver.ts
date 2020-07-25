import { Role } from '@karuta/avalon-core';

import shuffle from '../util/shuffle';

import EventDriver from './EventDriver';
import Event from './GameEvent';
import Player from './Player';
import Quest from './Quest';
import Vision from './Vision';
import SkillList from '../skills';

/**
 * Game Driver
 */
export default class GameDriver extends EventDriver<Event> {
	protected roles: Role[];

	protected seats: Map<number, Player>;

	protected playerNum: number;

	protected questLeader: number;

	protected quests: Quest[];

	/**
	 * Create a game engine
	 */
	constructor() {
		super();

		this.roles = [];
		this.seats = new Map();
		this.playerNum = 0;
		this.questLeader = 0;
		this.quests = [];
	}

	/**
	 * Set the number of players
	 * @param num
	 */
	setPlayerNum(num: number): void {
		this.playerNum = num;
	}

	/**
	 * @return the number of players
	 */
	getPlayerNum(): number {
		return this.playerNum;
	}

	/**
	 * Set up roles
	 * @param {Role[]} roles
	 */
	setRoles(roles: Role[]): void {
		this.roles = roles;
	}

	/**
	 * @return Used roles
	 */
	getRoles(): Role[] {
		return this.roles;
	}

	/**
	 * Start game
	 */
	start(): void {
		this.playerNum = this.roles.length;
		this.questLeader = 1 + Math.floor(Math.random() * this.playerNum);

		this.arrangeRoles();
	}

	/**
	 * @return The seat number of current quest leader.
	 */
	getQuestLeader(): number {
		return this.questLeader;
	}

	/**
	 * Arrange roles
	 */
	arrangeRoles(): void {
		const roles = [...this.roles];
		shuffle(roles);

		for (let seat = 1; seat <= this.playerNum; seat++) {
			this.seats.set(seat, new Player(seat, roles[seat - 1]));
		}

		for (const SkillClass of SkillList) {
			const skill = new SkillClass();
			if (roles.includes(skill.getRole())) {
				this.register(skill);
			}
		}
	}

	/**
	 * @param seat
	 * @return Check if the seat exists
	 */
	hasSeat(seat: number): boolean {
		return this.seats.has(seat);
	}

	/**
	 * Take one seat
	 * @param seat seat number
	 * @param seatKey seat key
	 * @return if the seat hasn't been take, return the role.
	 */
	takeSeat(seat: number, seatKey: string): Vision | null {
		const player = this.seats.get(seat);
		if (!player) {
			return null;
		}

		if (!player.getSeatKey()) {
			player.setSeatKey(seatKey);
		} else if (player.getSeatKey() !== seatKey) {
			return null;
		}

		const vision: Vision = {
			player,
			role: player.getRole(),
		};
		this.trigger(Event.TakingSeat, vision);
		this.trigger(Event.AfterTakingSeat, vision);

		return vision;
	}

	/**
	 * Get a player by seat number
	 * @param seat
	 */
	getPlayer(seat: number): Player | undefined {
		return this.seats.get(seat);
	}

	/**
	 * @return All players
	 */
	getPlayers(): Map<number, Player> {
		return this.seats;
	}

	/**
	 * Add a quest into the game
	 * @param
	 */
	addQuest(leader: Player, members: Player[]): Quest | null {
		const quest = new Quest(this.playerNum, this.quests.length + 1, leader, members);
		if (quest.isValid()) {
			this.quests.push(quest);
			return quest;
		}
		return null;
	}

	getQuests(): Quest[] {
		return this.quests;
	}

	getQuest(seq: number): Quest | null {
		return this.quests[seq];
	}

	/**
	 * @return The current quest
	 */
	getCurrentQuest(): Quest | null {
		if (this.quests.length > 0) {
			return this.quests[this.quests.length - 1];
		}
		return null;
	}
}
