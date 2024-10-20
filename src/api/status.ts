import {
	Router,
	Request,
	Response,
} from 'express';

import { lobby } from '../core/index.js';

const router = Router();
router.get('/', (req: Request, res: Response): void => {
	const status = lobby.getStatus();
	res.json(status);
});

export default router;
