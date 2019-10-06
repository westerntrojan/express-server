import http from 'http';
import optimist from 'optimist';

import getLogger from './utils/logger';
import app from './app';
import io from './socket.io';

const logger = getLogger(module);

const server = http.createServer(app);
server.timeout = 5000;

io(server);

const port = process.env.PORT || optimist.argv.port;
server.listen(port, () => logger.info(`Server listening on http://127.0.0.1:${port}`));
