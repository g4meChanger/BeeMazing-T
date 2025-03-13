const CACHE_NAME = 'family-app-cache-v1';
const urlsToCache = [
  '/', // Root path to cache the homepage
  '/home.html',
  '/addtasks.html',
  '/tasks.html',
  '/shop.html',
  '/stats.html',
  '/users.html',
  '/users.css',
  '/home.js', // JavaScript files
  '/icons/icon-192x192.png', // Icons
  '/icons/icon-512x512.png',
  'https://kit.fontawesome.com/a076d05399.js', // External resources, like FontAwesome
];

// Install event: Cache files during the service worker installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // Cache all necessary files
      })
  );
});

// Fetch event: Serve cached files if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If there's a cached response, return it
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise, fetch from the network
        return fetch(event.request);
      })
  );
});

// Activate event: Clean old caches during service worker activation
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName); // Remove outdated caches
            }
          })
        );
      })
  );
});
