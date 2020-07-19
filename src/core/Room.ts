import randstr from '../util/randstr';

import Driver from './Driver';

/**
 * Game Room
 */
export default class Room {
	protected id: number;

	protected driver?: Driver;

	protected ownerKey: string;

	constructor() {
		this.id = 0;
		this.ownerKey = randstr(32);
	}

	/**
	 * Set up a game driver
	 * @param driver
	 */
	setDriver(driver: Driver): void {
		this.driver = driver;
	}

	/**
	 * Get the game engine
	 */
	getriver(): Driver | undefined {
		return this.driver;
	}
}
