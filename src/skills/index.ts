import Skill from '../driver/Skill';

import Merlin from './Merlin';
import Minion from './Minion';

type SkillConstructor = new() => Skill<unknown>;

const skills: SkillConstructor[] = [
	Merlin,
	Minion,
];

export default skills;
