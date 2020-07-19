import { Role } from '@karuta/avalon-core';

import VisionItem from './VisionItem';

interface Vision {
	role: Role;
	others?: VisionItem[];
}

export default Vision;
