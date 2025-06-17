self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('fastest-draw-cache').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './showdown.png',
        './icon-192.png',
        './icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
