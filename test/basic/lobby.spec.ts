import Lobby from '../../src/core/Lobby';
import Room from '../../src/core/Room';

const lobby = new Lobby(100);
const room = new Room();
let roomId = 0;

function idle(msecs: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, msecs);
	});
}

it('adds a room', () => {
	expect(lobby.add(room)).toBe(true);
	roomId = room.getId();
	expect(roomId).toBeGreaterThan(0);
});

it('confirms room existance', () => {
	expect(lobby.get(roomId)).toBe(room);
});

it('confirms room expiry', async () => {
	await idle(101);
	expect(lobby.get(roomId)).toBeUndefined();
});
