/**
 * @jest-environment node
 */
const makeServiceWorkerEnv = require('service-worker-mock');
const makeFetchMock = require('service-worker-mock/fetch');

jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
const pathToSw = '../../temp/sw.js';

describe('Service worker', () => {
  beforeEach(() => {
    const serviceWorkerEnv = makeServiceWorkerEnv();
    serviceWorkerEnv.fetch = makeFetchMock;
    Object.assign(global, serviceWorkerEnv);

    self.__WB_MANIFEST = [{ url: '/index.html', revision: '5961ba0ce1462673888c9f8250f6b371' }];
    jest.resetModules();
    require('fake-indexeddb/auto');
  });

  it('should add listeners', () => {
    require(pathToSw);
    console.log('require(pathToSw)', require(pathToSw));
    const registeredListeners = Array.from(self.listeners.keys());

    expect(registeredListeners).toContain('install');
    expect(registeredListeners).toContain('message');
    expect(registeredListeners).toContain('fetch');
    expect(registeredListeners).toContain('push');
    expect(registeredListeners).toContain('notificationclick');
  });

  it('should precache static resources', async () => {
    const expectedUrls = [
      expect.stringMatching(/index.html/),
      expect.stringMatching(/manifest.json/),
    ];

    require(pathToSw);
    await self.trigger('install');
    // await Promise is used because workbox have to install caches
    // in such way we continue testing on next tick, when caches are ready
    await new Promise((r) => setTimeout(r));
    const precachedKey = await self.caches
      .keys()
      .then((keys) => keys.find((str) => /workbox-precache/.test(str)));
    const precachedUrls = await self.caches
      .open(precachedKey)
      .then((cache) => cache.keys())
      .then((cachedRequests) => cachedRequests.map((request) => request.url));

    expect(precachedUrls).not.toHaveLength(0);
    expect(precachedUrls).toEqual(expect.arrayContaining(expectedUrls));
  });

  it('should cache fonts', async () => {
    require(pathToSw);
    await self.trigger('install');

    self.trigger('fetch', 'https://yastatic.net/islands/_/7_GKBdKFbUPzKlghJRv55xgz0FQ.woff2');
    await new Promise((r) => setTimeout(r));
    const isFontsCachePresent = await self.caches.has('yastatic-fonts');
    const cachedFonts = await self.caches.open('yastatic-fonts').then((c) => c.keys());

    expect(isFontsCachePresent).toBe(true);
    expect(cachedFonts).toHaveLength(1);
  });

  it('should cache api get requests with NetworkFirst strategy', async () => {
    require(pathToSw);
    await self.trigger('install');

    await self.trigger('fetch', 'https://www.test.com/api/settings');
    await self.trigger('fetch', 'https://www.test.com/api/builds?offset=0&limit=25');
    await self.trigger(
      'fetch',
      'https://www.test.com/api/builds/a06e26e5-58b7-414f-bd05-decdac37fea0',
    );
    await new Promise((r) => setTimeout(r));

    const isApiRequestCached = await self.caches.has('api-get-requests');
    const cachedRequests = await self.caches.open('api-get-requests').then((c) => c.keys());

    expect(isApiRequestCached).toBe(true);
    expect(cachedRequests).toHaveLength(3);
  });
  it('should cache api get requests with CacheFirst strategy', async () => {
    require(pathToSw);
    await self.trigger('install');

    await self.trigger(
      'fetch',
      'https://www.test.com/api/builds/a06e26e5-58b7-414f-bd05-decdac37fea0/logs',
    );
    await new Promise((r) => setTimeout(r));

    const isApiRequestCached = await self.caches.has('api-cachedonly-get-requests');
    const cachedRequests = await self.caches
      .open('api-cachedonly-get-requests')
      .then((c) => c.keys());

    expect(isApiRequestCached).toBe(true);
    expect(cachedRequests).toHaveLength(1);
  });
});
