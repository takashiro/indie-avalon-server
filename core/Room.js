
/**
 * Game Room
 */
class Room {

	constructor() {
		this.id = 0;
		this.engine = null;
		this.ownerKey = Math.floor(Math.random() * 0xFFFF);
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
