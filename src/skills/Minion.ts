import {
	Role,
	Team,
} from '@karuta/avalon-core';

import Event from '../driver/GameEvent';
import Skill from '../driver/Skill';
import Vision from '../driver/Vision';

export default class Minion extends Skill<Vision> {
	constructor() {
		super(Event.TakingSeat, Role.Minion);
	}

	isTriggerable(vision: Vision): boolean {
		return vision.player.getTeam() === Team.Minion;
	}

	process(vision: Vision): boolean {
		const driver = this.getDriver();
		if (!driver) {
			return false;
		}

		const self = vision.player;
		const mates = [];
		for (const [seat, player] of driver.getPlayers()) {
			if (seat !== self.getSeat() && player.getTeam() === Team.Minion) {
				mates.push(seat);
			}
		}
		vision.others = mates.map((seat) => ({ seat }));
		return false;
	}
}
