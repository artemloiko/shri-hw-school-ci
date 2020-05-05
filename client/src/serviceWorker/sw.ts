importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

type PrecacheEntry = { revision: string; url: string };
declare interface ServiceWorkerGlobalScope {
  __WB_MANIFEST: PrecacheEntry[];
}
const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const STATIC_SOURCES_VERSION = '1';
const staticResourcesManifest = [
  { url: '/manifest.json', revision: STATIC_SOURCES_VERSION },
  { url: '/favicon.ico', revision: STATIC_SOURCES_VERSION },
];
const compiledResourcesManifest = self.__WB_MANIFEST || [];
const assetsToCache = [...compiledResourcesManifest, ...staticResourcesManifest];
// @ts-ignore it is right here
const { CacheableResponsePlugin } = workbox.cacheableResponse;
// @ts-ignore it is right here
const { ExpirationPlugin } = workbox.expiration;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { NavigationRoute, registerRoute } = workbox.routing;
// @ts-ignore createHandlerBoundToURL is available in workbox v5 (types are for 4)
const { createHandlerBoundToURL, precacheAndRoute } = workbox.precaching;

// precashe static sources
workbox.precaching.precacheAndRoute(assetsToCache);

// handle spa navigation, always return index.html
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {});
registerRoute(navigationRoute);

// cashe StaleWhileRevalidate /api/settings and /api/builds
registerRoute(/\/api\/(settings|builds)(\?.+)?$/, new StaleWhileRevalidate());

// cashe StaleWhileRevalidate /api/builds/:buildId
registerRoute(/\/api\/builds\/[\w-]+$/, new StaleWhileRevalidate());

// cashe CacheFirst /api/builds/:buildId/logs
registerRoute(
  /\/api\/builds\/.+\/logs/,
  new CacheFirst({
    cacheName: 'api-cachedonly-get-requests',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        purgeOnQuotaError: true,
        maxEntries: 100,
      }),
    ],
  }),
);

// cashe fonts
registerRoute(
  /^https:\/\/yastatic\.net/,
  new CacheFirst({
    cacheName: 'yastatic-fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: YEAR_IN_SECONDS,
        maxEntries: 30,
      }),
    ],
  }),
);

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('sw installed, assets:', assetsToCache);
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('sw activated');
});

self.addEventListener('message', (event) => {
  console.log('SW MESSAGE', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
