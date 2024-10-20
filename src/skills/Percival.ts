import { Role } from '@karuta/avalon-core';

import Vision from '../driver/Vision.js';
import GameEvent from '../driver/GameEvent.js';
import Skill from '../driver/Skill.js';

export default class Percival extends Skill<Vision> {
	constructor() {
		super(GameEvent.TakingSeat, Role.Percival);
	}

	isTriggerable(vision: Vision): boolean {
		return vision.role === this.role;
	}

	process(vision: Vision): boolean {
		const driver = this.getDriver();
		const magicians = [];
		for (const [seat, player] of driver.getPlayers()) {
			if (player.getRole() === Role.Merlin) {
				magicians.push(seat);
				break;
			}
		}
		vision.others = magicians.map((seat) => ({ seat }));
		return false;
	}
}
