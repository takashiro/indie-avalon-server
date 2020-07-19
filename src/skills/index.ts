import Skill from '../driver/Skill';

import Merlin from './Merlin';
import Minion from './Minion';
import Mordred from './Mordred';

type SkillConstructor = new() => Skill<unknown>;

const skills: SkillConstructor[] = [
	Merlin,
	Minion,
	Mordred,
];

export default skills;
