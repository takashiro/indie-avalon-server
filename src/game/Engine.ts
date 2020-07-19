import {
	Role,
} from '@karuta/avalon-core';

import shuffle from '../util/shuffle';

import Timing from './Timing';
import Player  from './Player';
import Quest from './Quest';

import SkillList from './skills';
import Vision from './Vision';

/**
 * Game Engine
 */
export default class Engine {
	protected roles: Role[];

	protected seats: Map<number, Player>;

	protected playerNum: number;

	protected questLeader: number;

	protected quests: Quest[];

	/**
	 * Create a game engine
	 */
	constructor() {
		this.roles = [];
		this.seats = new Map;
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
	 * Start game
	 */
	start(): void {
		this.playerNum = this.roles.length;
		this.questLeader = 1 + Math.floor(Math.random() * this.playerNum);

		this.arrangeRoles();
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
	takeSeat(seat: number, seatKey: number): Vision | null {
		let player = this.seats.get(seat);
		if (!player) {
			return null;
		}

		if (player.getSeatKey() === null) {
			player.setSeatKey(seatKey);
		} else if (player.getSeatKey() !== seatKey) {
			return null;
		}

		const vision: Vision = {
			role: player.getRole(),
		};
		this.trigger(Timing.GameStart, player, vision);

		return vision;
	}

	/**
	 * Get a player by seat number
	 * @param {number} seat
	 * @return {Player}
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
	 * Invoke corresponding role skills
	 * @param timing
	 * @param player
	 * @param extra
	 */
	trigger<ParamType>(timing: Timing, player: Player, extra: ParamType): void {
		for (let skill of SkillList) {
			if (skill.timing !== timing || !skill.onEffect(this, player)) {
				continue;
			}

			if (skill.effect(this, player, extra)) {
				break;
			}
		}
	}

	/**
	 * Add a quest into the game
	 * @param quest
	 */
	addQuest(quest: Quest): void {
		this.quests.push(quest);
	}

	/**
	 * @return The current quest
	 */
	get currentQuest(): Quest | null {
		if (this.quests.length > 0) {
			return this.quests[this.quests.length - 1];
		} else {
			return null;
		}
	}

}
