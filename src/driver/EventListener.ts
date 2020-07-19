import EventDriver from './EventDriver';

export default abstract class EventListener<EventType, ParamType> {
	readonly event: EventType;

	protected driver?: EventDriver<EventType>;

	constructor(event: EventType) {
		this.event = event;
	}

	getDriver(): EventDriver<EventType> | undefined {
		return this.driver;
	}

	setDriver(driver: EventDriver<EventType> | undefined) {
		this.driver = driver;
	}

	/**
	 * @param data Event data
	 * @return Whether the listener can be invoked.
	 */
	abstract isTriggerable(data: ParamType): boolean;

	/**
	 * Process the listener.
	 * @param data
	 */
	abstract process(data: ParamType): boolean;
}
