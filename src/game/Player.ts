import {
	Role,
	Team,
	RoleMap,
} from '@karuta/avalon-core';

export default class Player {
	protected seat: number;

	protected seatKey: number;

	protected role: Role;

	protected team: Team;

	/**
	 * Create a Player instance
	 * @param seat
	 * @param role
	 */
	constructor(seat: number, role: Role) {
		this.seat = seat;
		this.seatKey = 0;
		this.role = role;
		this.team = RoleMap.get(role) || Team.Unknown;
	}

	getRole(): Role {
		return this.role;
	}

	setRole(role: Role): void {
		this.role = role;
		this.team = RoleMap.get(role) || Team.Unknown;
	}

	getTeam(): Team {
		return this.team;
	}

	getSeat(): number {
		return this.seat;
	}

	setSeat(seat: number): void {
		this.seat = seat;
	}

	getSeatKey(): number {
		return this.seatKey;
	}

	setSeatKey(key: number): void {
		this.seatKey = key;
	}
}
