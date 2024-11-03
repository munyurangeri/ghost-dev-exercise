importScripts("idb.js");

const FILES_CACHE_NAME = "files-cache-v1";
const IMAGES_CACHE_NAME = "images-cache-v1";
const API_END_POINTS = ["/stories/"];

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/idb.js",
  "/robots.txt",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(FILES_CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (![FILES_CACHE_NAME, IMAGES_CACHE_NAME].includes(cache)) {
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
  const { request } = event;
  const url = new URL(request.url);

  const isApiRequest = API_END_POINTS.some((el) => {
    return url.pathname.startsWith(el);
  });

  if (request.method === "GET" && isApiRequest)
    event.respondWith(handleGetRequest(request));
  else event.respondWith(handleFileRequest(request));

  if (request.method === "POST") {
    event.respondWith(handlePostRequest(request));
  }
});

async function handleFileRequest(request) {
  return caches.match(request).then(async (cache) => {
    if (cache) return cache;

    const response = await fetch(request);

    const url = new URL(request.url);

    if (url.pathname.startsWith("/images/")) {
      const imageCache = await caches.open(IMAGES_CACHE_NAME);
      imageCache.put(url.href, response.clone());
    }

    if (
      url.pathname.startsWith("/assets/index-") ||
      url.hostname.startsWith("fonts.")
    ) {
      const imageCache = await caches.open(FILES_CACHE_NAME);
      imageCache.put(url.href, response.clone());
    }

    return response;
  });
}

async function handleGetRequest(request) {
  const cachedData = await getCachedData(request.url);

  if (cachedData) {
    fetchAndUpdateCache(request);

    return new Response(JSON.stringify(cachedData.data), {
      "Content-Type": "application/json",
    });
  } else {
    return fetchAndUpdateCache(request);
  }
}

async function fetchAndUpdateCache(request) {
  try {
    const response = await fetch(request);

    if (
      response.headers.get("content-type")?.includes("application/json") &&
      !request.url.includes("manifest")
    ) {
      const data = await response.clone().json();
      await saveToCache(request.url, data);
    }

    // TODO: Notify the cllient of fresh data (if in foreground)

    return response;
  } catch (error) {
    // console.error("network request failed", error);

    return new Response("Network error", { status: 500 });
  }
}

async function handlePostRequest(request) {
  console.log({ request });
}
