
const Skills = [
	require('./Merlin'),
	require('./Percival'),
	require('./Morgana'),
	require('./Rebel'),
	require('./Oberon'),
];

module.exports = Skills.map(Skill => new Skill);
