const http = require('http');
const consola = require('consola');
require('graphql-import-node');

const app = require('./app');
const graphql = require('./graphql');

const httpServer = http.createServer(app);
httpServer.timeout = 5000;

graphql.applyMiddleware({app});
graphql.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
	consola.ready({
		message: `Server listening on http://127.0.0.1:${port}`,
		badge: true,
	});
});
