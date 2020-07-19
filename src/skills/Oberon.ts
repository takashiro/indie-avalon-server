import { Role, Team } from '@karuta/avalon-core';

import Event from '../driver/GameEvent';
import Skill from '../driver/Skill';
import Vision from '../driver/Vision';

export default class Oberon extends Skill<Vision> {
	constructor() {
		super(Event.AfterTakingSeat, Role.Oberon);
	}

	isTriggerable(vision: Vision) {
		const { player } = vision;
		return player.getTeam() === Team.Minion;
	}

	process(vision: Vision): boolean {
		const mates = vision.others;
		if (!mates) {
			return false;
		}

		if (vision.role === this.role) {
			mates.splice(0, mates.length);
		} else {
			const driver = this.getDriver();
			for (let i = 0; i < mates.length; i++) {
				const { seat } = mates[i];
				const player = driver.getPlayer(seat);
				if (player && player.getRole() === this.role) {
					mates.splice(i, 1);
					i--;
				}
			}
		}

		return false;
	}
}
