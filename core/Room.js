
const randstr = require('../util/randstr');

/**
 * Game Room
 */
class Room {

	constructor() {
		this.id = 0;
		this.engine = null;
		this.ownerKey = randstr(32);
	}

	/**
	 * Set up a game engine
	 * @param {Engine} engine
	 */
	setEngine(engine) {
		this.engine = engine;
	}

	/**
	 * Get the game engine
	 */
	getEngine() {
		return this.engine;
	}

}

module.exports = Room;
