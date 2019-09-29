import http from 'http';
import optimist from 'optimist';
import 'graphql-import-node';

import getLogger from './utils/logger';
import app from './app';
import graphql from './graphql';

const logger = getLogger(module);

const httpServer = http.createServer(app);
httpServer.timeout = 5000;

graphql.applyMiddleware({app});
graphql.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || optimist.argv.port;
httpServer.listen(port, () => logger.info(`Server listening on http://127.0.0.1:${port}`));
