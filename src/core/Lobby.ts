import { LobbyStatus } from '@karuta/avalon-core';

import Room from './Room';

let nextRoomId = 0;

/**
 * Room Manager
 */
export default class Lobby {
	protected roomNumLimit: number;

	protected rooms: Map<number, Room>;

	protected roomExpiry: number;

	constructor(roomExpiry = 12 * 60 * 60 * 1000, roomNumLimit = 1000) {
		this.roomNumLimit = roomNumLimit;
		this.rooms = new Map;
		this.roomExpiry = roomExpiry;
	}

	setRoomNumLimit(limit: number): void {
		this.roomNumLimit = limit;
	}

	getRoomNumLimit(): number {
		return this.roomNumLimit;
	}

	setRoomExpiry(expiry: number): void {
		this.roomExpiry;
	}

	getRoomExpiry(): number {
		return this.roomExpiry;
	}

	/**
	 * @return Current status of Lobby
	 */
	getStatus(): LobbyStatus {
		return {
			roomNum: this.rooms.size,
			roomNumLimit: this.roomNumLimit,
		};
	}

	/**
	 * @return Check if there's still any vacancy to create a new room
	 */
	isAvailable(): boolean {
		return this.rooms.size < this.roomNumLimit;
	}

	/**
	 * Get a room by id
	 * @param id
	 */
	get(id: number): Room | undefined {
		return this.rooms.get(id);
	}

	/**
	 * Add a new room and assign room id
	 * @param room
	 * @return Whether the room is successfully added
	 */
	add(room: Room): boolean {
		if (this.rooms.size >= this.roomNumLimit) {
			return false;
		}

		do {
			nextRoomId++;
			if (nextRoomId > this.roomNumLimit) {
				nextRoomId = 1;
			}
		} while (this.rooms.has(nextRoomId));

		room.setId(nextRoomId);
		const roomId = room.getId();
		this.rooms.set(roomId, room);

		setTimeout(() => {
			this.remove(roomId);
		}, this.roomExpiry);

		return true;
	}

	/**
	 * Delete an existing room by room id
	 * @param id Room ID
	 * @return Whether the room exists and is successfully deleted
	 */
	remove(id: number): boolean {
		if (this.rooms.has(id)) {
			this.rooms.delete(id);
			return true;
		} else {
			return false;
		}
	}
}
