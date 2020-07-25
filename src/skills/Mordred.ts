import { Role } from '@karuta/avalon-core';

import Event from '../driver/GameEvent';
import Skill from '../driver/Skill';
import Vision from '../driver/Vision';

export default class Mordred extends Skill<Vision> {
	constructor() {
		super(Event.AfterTakingSeat, Role.Mordred);
	}

	isTriggerable(vision: Vision): boolean {
		return vision.role === Role.Merlin;
	}

	process(vision: Vision): boolean {
		const minions = vision.others;
		if (!minions) {
			return false;
		}

		const driver = this.getDriver();
		for (let i = 0; i < minions.length; i++) {
			const player = driver.getPlayer(minions[i].seat);
			if (player && player.getRole() === this.role) {
				minions.splice(i, 1);
				i--;
			}
		}

		return false;
	}
}
