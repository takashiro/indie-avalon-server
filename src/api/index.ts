import { Router } from 'express';

import status from './status';

const routerMap = new Map<string, Router>();
routerMap.set('status', status);
export default routerMap;
