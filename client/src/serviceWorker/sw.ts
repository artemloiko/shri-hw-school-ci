type PreCashedResource = { revision: string; url: string };
declare interface ServiceWorkerGlobalScope {
  __WB_MANIFEST: PreCashedResource[];
}

const assetsToCache = self.__WB_MANIFEST || [];

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('sw installed', assetsToCache);
  event.waitUntil(new Promise((res) => setTimeout(res, 2020)));
});

self.addEventListener('install', function (event: ExtendableEvent) {
  console.log('sw second install listener');
  event.waitUntil(new Promise((res) => setTimeout(res, 2020)));
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('sw activated');
});
