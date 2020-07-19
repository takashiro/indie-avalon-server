import { Role } from '@karuta/avalon-core';

import Player from './Player';
import VisionItem from './VisionItem';

interface Vision {
	player: Player;
	role: Role;
	others?: VisionItem[];
}

export default Vision;
