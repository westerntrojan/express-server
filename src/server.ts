import http from 'http';

import getLogger from './utils/logger';
import app from './app';
import io from './sockets';

const logger = getLogger(module);

const server = http.createServer(app);
const pid = process.pid;
server.timeout = 5000;

io(server);

const port = process.env.PORT || 8080;
server.listen(port, () =>
	logger.info(`Server listening on http://127.0.0.1:${port}. Started worker ${pid}`),
);
