import { Router } from 'express';

import status from './status.js';
import room from './room/index.js';

const routerMap = new Map<string, Router>();
routerMap.set('status', status);
routerMap.set('room', room);
export default routerMap;
