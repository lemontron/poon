import { WebApp } from 'meteor/webapp';

const sources = [Assets.getTextAsync('assets/service-worker.js')];

export const addServiceWorkerSource = source => sources.push(source);

WebApp.rawConnectHandlers.use('/service-worker.js', async (req, res) => {
	res.writeHead(200, {
		'content-type': 'application/javascript; charset=utf-8',
		'cache-control': 'no-cache',
		'service-worker-allowed': '/',
	});
	res.end((await Promise.all(sources)).join('\n'));
});
