import http from 'http';
import 'graphql-import-node';

import logger from './utils/logger';
import app from './app';
import graphql from './graphql';

const httpServer = http.createServer(app);
httpServer.timeout = 5000;

graphql.applyMiddleware({app});
graphql.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 8080;
httpServer.listen(port, () => logger.info(`Server listening on http://127.0.0.1:${port}`));
