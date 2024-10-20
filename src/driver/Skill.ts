import { Role } from '@karuta/avalon-core';

import Event from './GameEvent.js';
import EventListener from './EventListener.js';
import GameDriver from './GameDriver.js';

export default abstract class Skill<ParamType> extends EventListener<Event, ParamType> {
	protected role: Role;

	/**
	 * @param event
	 * @param role
	 */
	constructor(event: Event, role: Role) {
		super(event);

		this.role = role;
	}

	getRole(): Role {
		return this.role;
	}

	getDriver(): GameDriver {
		const driver = super.getDriver();
		if (driver instanceof GameDriver) {
			return driver;
		}
		throw new Error('GameDriver is not defined.');
	}
}
