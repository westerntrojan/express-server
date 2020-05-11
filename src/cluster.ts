import cluster from 'cluster';
import os from 'os';

import {getLogger} from './utils/logger';

const logger = getLogger(module);

if (cluster.isMaster) {
	const cpus = os.cpus().length;

	logger.info(`Clustering to ${cpus} CPUs`);

	cluster.on('exit', worker => {
		logger.warn(`Worker ${worker.process.pid} stopped working`);
		cluster.fork();
	});

	cluster.on('fork', worker => {
		logger.info(`Worker ${worker.process.pid} started`);
	});

	for (let i = 0; i < cpus; i++) {
		cluster.fork();
	}
} else {
	require('./server');
}
