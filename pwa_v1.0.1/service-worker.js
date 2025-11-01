const CACHE_NAME = 'number-recall-trainer-v1';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching offline assets');
      return cache.addAll(OFFLINE_ASSETS);
    }).catch(err => {
      console.error('[Service Worker] Failed to cache assets:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log('[Service Worker] Deleting old cache:', key);
          return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        console.log('[Service Worker] Serving from cache:', request.url);
        return cached;
      }
      
      return fetch(request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, cloned);
        });
        return response;
      }).catch(() => {
        // If fetch fails and it's a navigation request, serve index.html
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        // Otherwise, return a basic offline response
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

