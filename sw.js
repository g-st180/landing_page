// Service Worker for caching static assets with long cache lifetime
const CACHE_NAME = '7oh-landing-page-v2';

// Get base path for GitHub Pages compatibility
const getBasePath = () => {
  const path = self.location.pathname;
  const pathParts = path.split('/');
  // If we're in a subdirectory (like /landing_page/), use it as base
  if (pathParts.length > 2 && pathParts[1]) {
    return '/' + pathParts[1] + '/';
  }
  return '/';
};

const BASE_PATH = getBasePath();
const STATIC_ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'css/styles.css',
  BASE_PATH + 'js/script.js',
  BASE_PATH + 'images/hero-background.jpeg'
];

// Cache duration: 1 year (31536000 seconds)
const CACHE_DURATION = 31536000;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Cache addAll failed, caching individually:', err);
        // If addAll fails, try caching individually
        return Promise.all(
          STATIC_ASSETS.map(url => {
            return fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {
              // Ignore individual failures
            });
          })
        );
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache with long lifetime, fallback to network
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        // Create a new response with cache headers
        const headers = new Headers(response.headers);
        headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}, immutable`);
        headers.set('Expires', new Date(Date.now() + CACHE_DURATION * 1000).toUTCString());
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the new response with long lifetime
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        // Add cache headers to the response
        const headers = new Headers(response.headers);
        headers.set('Cache-Control', `public, max-age=${CACHE_DURATION}, immutable`);
        headers.set('Expires', new Date(Date.now() + CACHE_DURATION * 1000).toUTCString());
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      });
    })
  );
});

