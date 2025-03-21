importScripts("idb.js");

const FILES_CACHE_NAME = "files-cache-v3";
const IMAGES_CACHE_NAME = "images-cache-v3";
const API_END_POINTS = ["/stories/"];

const FILES_TO_CACHE = [
  "/",
  "/workers/reads-statistics.js",
  "/manifest.json",
  "/idb.js",
  "/robots.txt",
];

const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };

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
  const isApiRequest = API_END_POINTS.some((el) => url.pathname.startsWith(el));

  if (request.method === "POST")
    event.respondWith(handleApiPostRequest(request));
  else if (request.method === "GET" && isApiRequest)
    event.respondWith(handleApiGetRequest(request));
  else if (request.method === "GET" && url.pathname.startsWith("/reads"))
    event.respondWith(handleGetReadsRequest(request));
  else event.respondWith(handleNonApiRequest(request));
});

async function handleGetReadsRequest(request) {
  const currentReads = await getAllReads();

  const per_page = 20;
  const page =
    currentReads && currentReads.length
      ? Math.ceil(currentReads.length / per_page) + 1
      : 1;

  const { protocol, host, pathname, search } = new URL(request.url);
  const newRequest = new Request(
    `${protocol}//${host}${pathname}${search}&_page=${page}&_per_page=${per_page}`
  );

  if (!currentReads) {
    if (navigator.onLine) return fetchAndUpdateReadsCache(newRequest);

    return fallBackContent();
  }

  // Update reads cache
  if (navigator.onLine) fetchAndUpdateReadsCache(newRequest);

  return new Response(JSON.stringify(currentReads), CONTENT_TYPE_JSON);
}

async function fetchAndUpdateReadsCache(request) {
  try {
    const res = await fetch(request);
    const { data, next } = await res.json();

    // Update indexedDB reads
    saveReadsData(data);

    if (next) notifyForegroundClients("analytics");

    return new Response(JSON.stringify(data), CONTENT_TYPE_JSON);
  } catch (error) {
    return new Response("could not fetch and update cache", { status: 505 });
  }
}

async function handleNonApiRequest(request) {
  return caches.match(request).then(async (cache) => {
    if (!cache) return fetchAndUpdateNonApiRequest(request);

    fetchAndUpdateNonApiRequest(request);

    return cache;
  });
}

async function fetchAndUpdateNonApiRequest(request) {
  const { hostname, pathname, href } = new URL(request.url);

  const isImageOrIcon =
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/images/") ||
    hostname.startsWith("placehold.co");

  const isAssetOrFont =
    pathname.startsWith("/assets/index-") || hostname.startsWith("fonts.");

  if (isImageOrIcon) {
    return fetch(request)
      .then((response) => {
        caches
          .open(IMAGES_CACHE_NAME)
          .then((cache) => cache.put(href, response.clone()));
        return response;
      })
      .catch(() => caches.match(request));
  }

  if (isAssetOrFont) {
    return fetch(request)
      .then((response) => {
        if (response.ok)
          caches
            .open(FILES_CACHE_NAME)
            .then((cache) => cache.put(href, response.clone()));

        return response;
      })
      .catch(() => caches.match(request));
  }

  return fetch(request);
}

async function handleApiGetRequest(request) {
  const cachedData = await getCachedData(request.url);

  if (!cachedData) return fetchAndUpdateCache(request);

  return new Response(JSON.stringify(cachedData.data), CONTENT_TYPE_JSON);
}

async function fetchAndUpdateCache(request) {
  return fetch(request)
    .then(async (response) => {
      response
        .clone()
        .json()
        .then((data) => {
          return saveToCache(request.url, data).then(() =>
            notifyForegroundClients("update", request.url)
          );
        });

      return response;
    })
    .catch(() => fallBackContent());
}

async function handleApiPostRequest(request) {
  // First clone the body to save in case fetch fails
  const requestClone = request.clone();
  const body = await requestClone.json();

  return fetch(request)
    .then((response) => response)
    .catch(async () => {
      // If failed or offline, save POST request to IndexedDB
      await saveOfflinePostRequest(request.url, body);

      return new Response(
        JSON.stringify({ message: "saved locally", ...body }),
        { status: 202 }
      );
    });
}

self.addEventListener("message", (event) => {
  if (event.data?.action === "syncOfflineData") sendOfflinePostRequests();
});

async function sendOfflinePostRequests() {
  const requests = await getAndClearOfflinePostRequests();

  for (const { url, body } of requests) {
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { ...CONTENT_TYPE_JSON },
      });
    } catch (error) {
      console.log({ error, url, body });
      await saveOfflinePostRequest(url, body); // Re-save if sending failed
    }
  }
}

function notifyForegroundClients(type = "update", url = "", data = []) {
  self.clients.matchAll().then((clients) =>
    clients.forEach((client) => {
      client.postMessage({ type, url, data });
    })
  );
}

function fallBackContent() {
  return new Response(
    JSON.stringify({
      id: 0,
      family: "unknown",
      story:
        "Sorry, there is no story! Check if you have Internet connection and try again!",
      images: [],
    }),
    { status: 202 }
  );
}
