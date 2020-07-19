import { Role } from '@karuta/avalon-core';

import Event from './GameEvent';
import EventListener from './EventListener';
import GameDriver from './GameDriver';

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

	getDriver(): GameDriver | undefined {
		const driver = super.getDriver();
		if (driver instanceof GameDriver) {
			return driver;
		}
	}
}
