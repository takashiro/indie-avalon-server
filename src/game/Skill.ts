import { Role } from '@karuta/avalon-core';

import Timing from './Timing';
import Engine from './Engine';
import Player from './Player';

export default abstract class Skill<ParamType> {
	protected timing: Timing;

	protected role: Role;

	/**
	 * Skill owner
	 * @param timing
	 * @param role
	 */
	constructor(timing: Timing, role: Role) {
		this.timing = timing;
		this.role = role;
	}

	/**
	 * Check if the skill has effect on the player
	 * @param engine
	 * @param player
	 */
	onEffect(engine: Engine, player: Player) {
		return player && player.getRole() === this.role;
	}

	/**
	 * Add extra information when the role is taken
	 * @param engine
	 * @param player
	 * @param params extra arguments may exist
	 * @return Events will be stopped if it returns true
	 */
	abstract effect(engine: Engine, player: Player, params: ParamType): boolean;
}
