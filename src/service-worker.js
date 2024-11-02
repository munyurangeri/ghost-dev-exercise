import {
  getCachedData,
  saveToCache,
  saveOfflinePostRequest,
  getAndClearOfflinePostRequests,
} from "./idb";

const CACHE_NAME = "families-stories-cache-v1";

const FILES_TO_CACHE = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  console.log("installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("installed!!!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  saveToCache("https://test.com", "just testing database!");

  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
