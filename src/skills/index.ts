import Skill from '../driver/Skill';

import Merlin from './Merlin';
import Minion from './Minion';
import Mordred from './Mordred';
import Morgana from './Morgana';
import Oberon from './Oberon';
import Percival from './Percival';

type SkillConstructor = new() => Skill<unknown>;

const skills: SkillConstructor[] = [
	Merlin,
	Minion,
	Mordred,
	Morgana,
	Oberon,
	Percival,
];

export default skills;
