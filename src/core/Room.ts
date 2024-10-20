import randstr from '../util/randstr.js';

import Driver from './Driver.js';

/**
 * Game Room
 */
export default class Room {
	protected id: number;

	protected driver?: Driver;

	protected ownerKey: string;

	protected expiryTimer?: NodeJS.Timeout;

	constructor() {
		this.id = 0;
		this.ownerKey = randstr(32);
	}

	getId(): number {
		return this.id;
	}

	setId(id: number): void {
		this.id = id;
	}

	getOwnerKey(): string {
		return this.ownerKey;
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
	getDriver(): Driver | undefined {
		return this.driver;
	}

	setExpiryTimer(timer: NodeJS.Timeout): void {
		if (this.expiryTimer) {
			clearTimeout(this.expiryTimer);
		}
		this.expiryTimer = timer;
	}

	clearExpiryTimer(): void {
		if (this.expiryTimer) {
			clearTimeout(this.expiryTimer);
			delete this.expiryTimer;
		}
	}
}
