import http from 'http';
import './env';

import app from './app';
import {getLogger} from './utils/logger';
import socketServer from './socket-server';
import apolloServer from './apollo-server';

const logger = getLogger(module);

const httpServer = http.createServer(app);
const pid = process.pid;

socketServer(httpServer);

apolloServer.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 8080;
httpServer.listen(port, () =>
	logger.info(`Server listening on http://127.0.0.1:${port}. Started worker ${pid}`),
);

export default httpServer;
