
const Skills = [
	require('./Merlin'),
	require('./Percival'),
	require('./Morgana'),
];

module.exports = Skills.map(Skill => new Skill);
