const CACHE_NAME = 'poon-v1';
const SHELL_URL = '/__poon_app_shell__';
const STATIC_URLS = ['/manifest.json'];
const STATIC_DESTINATIONS = new Set(['font', 'image', 'manifest', 'script', 'style', 'audio']);

const cacheShell = async response => {
	const html = await response.clone().text();
	const urls = [...new Set([
		...STATIC_URLS,
		...[...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]),
	].map(url => new URL(url, self.location.origin)).filter(url => url.origin === self.location.origin).map(url => url.href))];
	const assets = await Promise.all(urls.map(url => fetch(url, {cache: 'no-store'})));
	if (assets.some(asset => !asset.ok)) throw new Error('Unable to cache shell');
	const cache = await caches.open(CACHE_NAME);
	await Promise.all(assets.map((asset, index) => cache.put(urls[index], asset)));
	await cache.put(SHELL_URL, response);
};

// Cache a complete app shell before the new worker takes control.
self.addEventListener('install', event => {
	event.waitUntil((async () => {
		const response = await fetch('/', {cache: 'no-store'});
		if (!response.ok) throw new Error(`Unable to cache app: ${response.status}`);
		await cacheShell(response);
		await self.skipWaiting();
	})());
});

// Remove superseded caches and begin handling open tabs immediately.
self.addEventListener('activate', event => {
	event.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(keys.filter(key => (key.startsWith('poon-') && key !== CACHE_NAME) || key === 'gohano-app').map(key => caches.delete(key)));
		await self.clients.claim();
	})());
});

// Prefer fresh app resources, falling back to the last complete offline shell.
self.addEventListener('fetch', event => {
	const {request} = event;
	if (request.method !== 'GET') return;
	if (request.headers.has('range')) return;

	if (request.mode === 'navigate') {
		const response = fetch(request).then(result => {
			if (!result.ok) throw new Error(`Unable to load app: ${result.status}`);
			return result;
		});
		event.waitUntil(response.then(result => {
			if (result.headers.get('content-type')?.includes('text/html')) return cacheShell(result.clone());
		}).catch(() => {}));
		event.respondWith(response.catch(() => caches.match(SHELL_URL)));
		return;
	}

	const url = new URL(request.url);
	if (url.origin !== self.location.origin || !STATIC_DESTINATIONS.has(request.destination)) return;

	const response = fetch(request);
	event.waitUntil(response.then(async result => {
		if (result.ok) await (await caches.open(CACHE_NAME)).put(request, result.clone());
	}).catch(() => {}));
	event.respondWith(response.catch(() => caches.match(request)));
});
