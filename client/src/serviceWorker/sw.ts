import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const isProduction = process.env.NODE_ENV === 'production';

const STATIC_SOURCES_VERSION = '1';
const staticResourcesManifest = [
  { url: '/manifest.json', revision: STATIC_SOURCES_VERSION },
  { url: '/favicon.ico', revision: STATIC_SOURCES_VERSION },
  { url: '/logo192.png', revision: STATIC_SOURCES_VERSION },
  { url: '/logo512.png', revision: STATIC_SOURCES_VERSION },
];
const compiledResourcesManifest = self.__WB_MANIFEST || [];
const assetsToCache = [...compiledResourcesManifest, ...staticResourcesManifest];

if (isProduction) {
  // precashe static sources
  precacheAndRoute(assetsToCache);
  // handle spa navigation, always return index.html
  const handler = createHandlerBoundToURL('/index.html');
  const navigationRoute = new NavigationRoute(handler, {});
  registerRoute(navigationRoute);
}

// cashe NetworkFirst /api/settings and /api/builds
registerRoute(/\/api\/(settings|builds)(\?.+)?$/, new NetworkFirst({ networkTimeoutSeconds: 2 }));

// cashe NetworkFirst /api/builds/:buildId
registerRoute(/\/api\/builds\/[\w-]+$/, new NetworkFirst({ networkTimeoutSeconds: 2 }));

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
  console.log('sw installed, assetsToCache:', assetsToCache);
});

self.addEventListener('message', (event) => {
  console.log('SW MESSAGE', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
