import Skill from '../driver/Skill.js';

import Merlin from './Merlin.js';
import Minion from './Minion.js';
import Mordred from './Mordred.js';
import Morgana from './Morgana.js';
import Oberon from './Oberon.js';
import Percival from './Percival.js';

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
