
const Skills = [
	require('./Merlin'),
];

module.exports = Skills.map(Skill => new Skill);
