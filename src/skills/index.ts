import Skill from '../driver/Skill';

import Merlin from './Merlin';

type SkillConstructor = new() => Skill<unknown>;

const skills: SkillConstructor[] = [
	Merlin,
];

export default skills;
