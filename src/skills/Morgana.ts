import { Role } from '@karuta/avalon-core';

import Event from '../driver/GameEvent.js';
import Skill from '../driver/Skill.js';
import Vision from '../driver/Vision.js';

export default class Morgana extends Skill<Vision> {
	constructor() {
		super(Event.AfterTakingSeat, Role.Morgana);
	}

	isTriggerable(vision: Vision): boolean {
		return vision.role === Role.Percival;
	}

	process(vision: Vision): boolean {
		const driver = this.getDriver();

		const magicians = vision.others;
		if (!magicians) {
			return false;
		}

		for (const [seat, player] of driver.getPlayers()) {
			if (player.getRole() === this.role) {
				magicians.push({ seat });
			}
		}

		return false;
	}
}
