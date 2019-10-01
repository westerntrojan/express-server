import http from 'http';
import optimist from 'optimist';

import getLogger from './utils/logger';
import app from './app';

const logger = getLogger(module);

const httpServer = http.createServer(app);
httpServer.timeout = 5000;

const port = process.env.PORT || optimist.argv.port;
httpServer.listen(port, () => logger.info(`Server listening on http://127.0.0.1:${port}`));
