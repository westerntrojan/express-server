import http from 'http';
import './env';

import app from './app';
import {getLogger} from './utils/logger';
import io from './sockets';
import {apolloServer} from './apolloServer';

const logger = getLogger(module);

const httpServer = http.createServer(app);
const pid = process.pid;
// httpServer.timeout = 5000;

io(httpServer);

apolloServer.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 8080;
httpServer.listen(port, () =>
	logger.info(`Server listening on http://127.0.0.1:${port}. Started worker ${pid}`),
);

export default httpServer;
