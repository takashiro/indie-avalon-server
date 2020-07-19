import express from 'express';

import Lobby from './Lobby';
import Config from './Config';

export const lobby = new Lobby();
export const app = express();
export const config = new Config();
