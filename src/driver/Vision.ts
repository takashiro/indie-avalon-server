import { Role } from '@karuta/avalon-core';

import Player from './Player.js';
import VisionItem from './VisionItem.js';

interface Vision {
	player: Player;
	role: Role;
	others?: VisionItem[];
}

export default Vision;
