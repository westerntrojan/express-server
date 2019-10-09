import cluster from 'cluster';
import os from 'os';

if (cluster.isMaster) {
	const cpus = os.cpus().length;

	console.log(`Clustering to ${cpus} CPUs`);

	cluster.on('exit', worker => {
		console.log(`Worker ${worker.process.pid} stopped working`);
		cluster.fork();
	});

	cluster.on('fork', worker => {
		console.log(`Worker ${worker.process.pid} started`);
	});

	for (let i = 0; i < cpus; i++) {
		cluster.fork();
	}
} else {
	require('./server');
}
