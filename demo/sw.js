/* eslint-disable */

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('install', event => {});

self.addEventListener('activate', event => {});

self.addEventListener('fetch', async event => {});
