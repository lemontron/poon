Package.describe({
	name: 'poon',
	version: '1.0.0',
	summary: 'Poon framework',
});

Package.onUse(api => {
	api.use('ecmascript');
	api.use('ejson');
	api.use('minimongo');
	api.use('random', 'client');
	api.use('meteor');
	api.use('localstorage', 'client');
	api.use('modules');
	api.use('webapp', 'server');
	api.use('react-meteor-data@4.0.1', 'client');
	api.use('tracker', 'client');
	api.use('mongo', 'client');
	api.use('poon-router', 'client');
	api.use('poon-markdown', 'client');
	api.mainModule('client.js', 'client');
	api.mainModule('server.js', 'server');
	api.addAssets('assets/service-worker.js', 'server');
	api.addFiles('assets/poon.css', 'client');
});
