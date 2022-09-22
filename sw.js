const APP_PREFIX = "TalkTooAAC",
			APP_VERSION = "0.0.0",
			CACHE_NAME = `${APP_PREFIX}_v${APP_VERSION}`;

// Main pages, CSS, JS, and various favicon images
let APP_URLS = [
	location.pathname,
	"favicon.ico",
	"index.html",
	"browserconfig.xml",
	"app.css",
	"app.js",
	"favicon.svg",
	"favicon-16x16.png",
	"favicon-32x32.png",
	"apple-touch-icon.png",
	"apple-touch-icon-precomposed.png",
	"apple-touch-icon-57x57.png",
	"apple-touch-icon-60x60.png",
	"apple-touch-icon-72x72.png",
	"apple-touch-icon-76x76.png",
	"apple-touch-icon-114x114.png",
	"apple-touch-icon-120x120.png",
	"apple-touch-icon-144x144.png",
	"apple-touch-icon-152x152.png",
	"android-chrome-36x36.png",
	"android-chrome-48x48.png",
	"android-chrome-72x72.png",
	"android-chrome-96x96.png",
	"android-chrome-144x144.png",
	"android-chrome-192x192.png",
	"android-chrome-256x256.png",
	"android-chrome-384x384.png",
	"android-chrome-512x512.png",
	"mstile-70x70.png",
	"mstile-144x144.png",
	"mstile-150x150.png",
	"mstile-310x150.png",
	"mstile-310x310.png",
	"safari-pinned-tab.svg"
];

// Button images, etc.
APP_URLS = APP_URLS.concat([
	"images/checkmark.svg",
	"images/delete.svg",
	"images/SPELLNUM.svg"
]);

// Cache APP_URLS when an install is requested
self.addEventListener("install", event => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll(APP_URLS);
	})());
});

// Provide from the cache before requesting from the network
self.addEventListener("fetch", event => {
	event.respondWith((async () => {
		const req = event.request,
					r = await caches.match(req);
		if (r) return r;
		const res = await fetch(req),
					cache = await caches.open(CACHE_NAME);
		cache.put(req, res.clone());
		return res;
	})());
});

// Delete old versions from the cache
self.addEventListener("activate", event => {
	event.waitUntil(caches.keys().then(keys => {
		return Promise.all(keys.map(key => {
			if (key === CACHE_NAME) return;
			return caches.delete(key);
		}));
	}));
});

self.addEventListener("message", event => {
	if (event.data.action === "skipWaiting") self.skipWaiting();
});