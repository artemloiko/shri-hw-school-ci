"use strict";
const assetsToCache = self.__WB_MANIFEST || [];
self.addEventListener('install', (event) => {
    console.log('sw installed', assetsToCache);
    event.waitUntil(new Promise((res) => setTimeout(res, 2020)));
});
self.addEventListener('install', function (event) {
    console.log('sw second install listener');
    event.waitUntil(new Promise((res) => setTimeout(res, 2020)));
});
self.addEventListener('activate', (event) => {
    console.log('sw activated');
});
