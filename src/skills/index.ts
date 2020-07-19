import Skill from '../driver/Skill';

import Merlin from './Merlin';
import Minion from './Minion';
import Mordred from './Mordred';
import Oberon from './Oberon';

type SkillConstructor = new() => Skill<unknown>;

const skills: SkillConstructor[] = [
	Merlin,
	Minion,
	Mordred,
	Oberon,
];

export default skills;
