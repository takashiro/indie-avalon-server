import EventListener from './EventListener';

export default class EventDriver<EventType> {
	protected listeners: Map<EventType, EventListener<EventType, unknown>[]>;

	constructor() {
		this.listeners = new Map();
	}

	register(listener: EventListener<EventType, unknown>): void {
		listener.setDriver(this);
		const listeners = this.listeners.get(listener.event);
		if (listeners) {
			listeners.push(listener);
		} else {
			this.listeners.set(listener.event, [listener]);
		}
	}

	trigger<ParamType>(event: EventType, data: ParamType): boolean {
		const listeners = this.listeners.get(event);
		if (!listeners) {
			return false;
		}

		for (const listener of listeners) {
			if (listener.isTriggerable(data)) {
				const prevented = listener.process(data);
				if (prevented) {
					return true;
				}
			}
		}

		return false;
	}
}
