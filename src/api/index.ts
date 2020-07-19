import { Router } from 'express';

import status from './status';
import room from './room';

const routerMap = new Map<string, Router>();
routerMap.set('status', status);
routerMap.set('room', room);
export default routerMap;
