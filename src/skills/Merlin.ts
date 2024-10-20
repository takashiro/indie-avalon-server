import {
	Role,
	Team,
} from '@karuta/avalon-core';

import Event from '../driver/GameEvent.js';
import Skill from '../driver/Skill.js';
import Vision from '../driver/Vision.js';

export default class Merlin extends Skill<Vision> {
	constructor() {
		super(Event.TakingSeat, Role.Merlin);
	}

	isTriggerable(vision: Vision): boolean {
		return vision.role === this.role;
	}

	process(vision: Vision): boolean {
		const driver = this.getDriver();
		const minions: number[] = [];
		for (const [seat, player] of driver.getPlayers()) {
			if (player.getTeam() === Team.Minion) {
				minions.push(seat);
			}
		}
		vision.others = minions.map((seat) => ({ seat }));
		return false;
	}
}
