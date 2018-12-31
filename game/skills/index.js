
const Skills = [
	require('./Merlin'),
	require('./Percival'),
	require('./Morgana'),
	require('./Minion'),
	require('./Oberon'),
	require('./Mordred'),
];

module.exports = Skills.map(Skill => new Skill);
