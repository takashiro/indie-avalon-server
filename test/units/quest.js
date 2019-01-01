
const assert = require('assert');
const UnitTest = require('../UnitTest');

class QuestTest extends UnitTest {

	constructor() {
		super('quest');
	}

	postQuest(input) {
		return this.post('quest', {id: this.room.id}, input);
	}

	async run() {
		console.log('Create a room');
		let roles = [1, 1, 1, 2, 3, 4];
		await this.post('room', {roles});

		this.room = await this.getJSON();

		console.log('Fetch roles');
		let players = [0];
		for (let seat = 1; seat <= roles.length; seat++) {
			await this.get('role', {id: this.room.id, seat: seat, seatKey: seat});
			let player = await this.getJSON();
			players.push(player);
		}

		console.log('Test room id');
		await this.post('quest', {}, {members: []});
		await this.assertError(400, 'Invalid room id');
		await this.post('quest', {id: this.room.id + 1}, {members: []});
		await this.assertError(404, 'The room does not exist');

		console.log('Test invalid leader seat number');
		await this.postQuest({members: [1, 2, 3]});
		await this.assertError(400, 'Invalid leader seat number');
		await this.postQuest({members: [1, 2, 3], seat: 10});
		await this.assertError(400, 'Leader seat number does not exist');

		console.log('Test invalid leader seat key');
		await this.postQuest({members: [1, 2, 3], seat: 1});
		await this.assertError(403, 'Invalid leader seat key');
		await this.postQuest({members: [1, 2, 3], seat: 1, seatKey: 2});
		await this.assertError(403, 'Invalid leader seat key');

		console.log('Test invalid quest members');
		await this.postQuest({members: {}, seat: 1, seatKey: '1'});
		await this.assertError(400, '`members` must be an array of integers');

		console.log('Create a quest');
		await this.postQuest({members: [1, 2], seat: 1, seatKey: '1'});
		await this.assertJSON({seq: 1});

		console.log('Test invalid member seat');
		await this.postQuest({questCard: true, seat: 10, seatKey: '1'});
		await this.assertError(400, 'Invalid seat number');

		console.log('Test invalid member seat key');
		await this.postQuest({questCard: false, seat: 2});
		await this.assertError(400, 'Seat and seat key is required to complete a quest');
		await this.postQuest({questCard: false, seat: 2, seatKey: '1'});
		await this.assertError(403, 'Incorrect seat key');

		console.log('Do Quest 1');
		await this.postQuest({questCard: true, seat: 1, seatKey: '1'});
		await this.assertJSON({seq: 1, questCard: true});

		console.log('Do duplicate quest');
		await this.postQuest({questCard: false, seat: 1, seatKey: '1'});
		await this.assertJSON({seq: 1});

		console.log('Check quest result');
		await this.postQuest({questCard: true, seat: 2, seatKey: '2'});
		await this.assertJSON({seq: 1, questCard: true});
		await this.get('quest', {id: this.room.id});
		let quest1 = {
			seq: 1,
			leader: 1,
			members: [1, 2],
			cards: {
				success: 2,
				fail: 0,
			},
			success: true
		};
		await this.assertJSON(quest1);

		console.log('Do Quest 2');
		await this.postQuest({members: [2, 3], seat: 5, seatKey: '5'});
		await this.assertError(400, 'The quest accepts 3 members');
		await this.postQuest({members: [2, 3, 4], seat: 5, seatKey: '5'});
		await this.assertJSON({seq: 2});
		await this.postQuest({questCard: true, seat: 2, seatKey: '2'});
		await this.postQuest({questCard: false, seat: 3, seatKey: '3'});
		await this.postQuest({questCard: true, seat: 4, seatKey: '4'});
		await this.get('quest', {id: this.room.id});
		let quest2 = {
			seq: 2,
			leader: 5,
			members: [2, 3, 4],
			cards: {
				success: 2,
				fail: 1,
			},
			success: false
		};
		await this.assertJSON(quest2);

		console.log('Do Quest 3');
		await this.postQuest({members: [2, 4, 5, 6], seat: 6, seatKey: '6'});
		await this.assertJSON({seq: 3});

		console.log('Create duplicate quest');
		await this.postQuest({members: [2, 4, 5], seat: 2, seatKey: '2'});
		await this.assertError(400, 'A quest is still on going');

		console.log('Fetch quests');
		await this.get('quests', {id: this.room.id});
		await this.assertJSON([quest1, quest2]);

		console.log('Delete a room');
		await this.delete('room', {id: this.room.id});
		await this.assertJSON({id: this.room.id});

		console.log('Test protected quest');
		await this.post('room', {roles: [1, 1, 1, 2, 3, 4, 5, 6]});
		this.room = await this.getJSON();
		for (let seat = 1; seat <= roles.length; seat++) {
			await this.get('role', {id: this.room.id, seat: seat, seatKey: seat});
		}

		await this.postQuest({members: [1, 2, 3], seat: 1, seatKey: '1'});
		await this.assertJSON({seq: 1});
		for (let seat = 1; seat <= 3; seat++) {
			await this.postQuest({questCard: true, seat, seatKey: String(seat)});
			await this.assertJSON({seq: 1, questCard: true});
		}
		await this.postQuest({members: [1, 2, 3, 4], seat: 1, seatKey: '1'});
		await this.assertJSON({seq: 2});
		for (let seat = 1; seat <= 4; seat++) {
			await this.postQuest({questCard: true, seat, seatKey: String(seat)});
			await this.assertJSON({seq: 2, questCard: true});
		}
		await this.postQuest({members: [1, 2, 3, 4], seat: 1, seatKey: '1'});
		await this.assertJSON({seq: 3});
		for (let seat = 1; seat <= 4; seat++) {
			let questCard = seat % 2 == 1;
			await this.postQuest({questCard, seat, seatKey: String(seat)});
			await this.assertJSON({seq: 3, questCard});
		}
		await this.postQuest({members: [1, 2, 3, 4, 5], seat: 1, seatKey: '1'});
		await this.assertJSON({seq: 4});
		for (let seat = 1; seat <= 5; seat++) {
			let questCard = seat > 1;
			await this.postQuest({questCard, seat, seatKey: String(seat)});
			await this.assertJSON({seq: 4, questCard});
		}
		await this.get('quest', {id: this.room.id});
		await this.assertJSON({
			seq: 4,
			leader: 1,
			members: [1, 2, 3, 4, 5],
			cards: {
				success: 4,
				fail: 1,
			},
			success: true
		});

		await this.delete('room', {id: this.room.id});
		await this.assertJSON({id: this.room.id});
	}

}

module.exports = QuestTest;
