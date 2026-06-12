const CACHE_NAME = 'semillas-v1781276369';
const ASSETS = [
  '/',
  '/index.html',
  '/mexico.html',
  '/work.html',
  '/teens.html',
  '/toolkit.html',
  '/blog.html',
  '/mexico.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/el-salvador/index.html',
  '/guatemala/index.html',
  '/guatemala/work.html',
  '/guatemala/teens.html',
  '/el-salvador/work.html',
  '/el-salvador/teens.html',
  '/blog/separated-by-borders.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only handle GET requests for same-origin resources
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback — return cached index for navigation requests
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html',
  '/mexico.html');
        }
      });
    })
  );
});
