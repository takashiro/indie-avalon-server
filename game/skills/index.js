
const Skills = [
	require('./Merlin'),
	require('./Percival'),
	require('./Morgana'),
	require('./Rebel'),
];

module.exports = Skills.map(Skill => new Skill);
