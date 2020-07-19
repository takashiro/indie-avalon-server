import express from 'express';

import router from './api';

const app = express();
app.use(express.json());

for (const [context, handler] of router) {
	app.use(`/${context}`, handler);
}

export default app;
