importScripts("idb.js");

const FILES_CACHE_NAME = "files-cache-v2";
const IMAGES_CACHE_NAME = "images-cache-v2";
const API_END_POINTS = ["/stories/"];

const FILES_TO_CACHE = ["/", "/manifest.json", "/idb.js", "/robots.txt"];

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
      ? Math.floor(currentReads.length / per_page) + 1
      : 1;

  const { protocol, host, pathname, search } = new URL(request.url);
  const newRequest = new Request(
    `${protocol}//${host}${pathname}${search}&_page=${page}&_per_page=${per_page}`
  );

  const res = await fetch(newRequest);
  const { data } = await res.json();

  // Update indexedDB reads
  saveReadsData(data);
  // .then((result) => console.log({ result }))
  // .catch((error) => console.log({ error }));

  return new Response(
    JSON.stringify({ ...currentReads, ...data }),
    CONTENT_TYPE_JSON
  );
}

async function handleNonApiRequest(request) {
  return caches.match(request).then(async (cache) => {
    if (cache) return cache;

    try {
      const response = await fetch(request);

      const url = new URL(request.url);

      if (url.pathname.startsWith("/images/")) {
        const imageCache = await caches.open(IMAGES_CACHE_NAME);
        await imageCache.put(url.href, response.clone());
      }

      if (
        url.pathname.startsWith("/assets/index-") ||
        url.hostname.startsWith("fonts.")
      ) {
        if (response && response.ok) {
          const fileCache = await caches.open(FILES_CACHE_NAME);
          await fileCache.put(url.href, response.clone());
        }
      }

      return response;
    } catch (error) {
      console.error(error);
    }
  });
}

async function handleApiGetRequest(request) {
  const cachedData = await getCachedData(request.url);

  if (!cachedData) return fetchAndUpdateCache(request);

  // Update cache and respond with current cache
  fetchAndUpdateCache(request);

  return new Response(JSON.stringify(cachedData.data), CONTENT_TYPE_JSON);
}

async function fetchAndUpdateCache(request) {
  try {
    const response = await fetch(request);
    const data = await response.clone().json();

    await saveToCache(request.url, data);

    // Notify the client of fresh data (if in foreground)
    self.clients.matchAll().then((clients) =>
      clients.forEach((client) => {
        client.postMessage({ type: "update", url: request.url });
      })
    );

    return response;
  } catch (error) {
    return new Response({ error: "Network error" }, { status: 500 });
  }
}

async function handleApiPostRequest(request) {
  // First clone the body to save in case fetch fails
  const requestClone = request.clone();
  const body = await requestClone.json();

  try {
    // Attempt to send request online
    const response = await fetch(request);
    return response;
  } catch (error) {
    // If failed or offline, save POST request to IndexedDB
    await saveOfflinePostRequest(request.url, body);

    return new Response(JSON.stringify({ message: "saved locally", ...body }), {
      status: 202,
    });
  }
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
      console.error("Failed to send offline POST request:", error);
      await saveOfflinePostRequest(url, body); // Re-save if sending failed
    }
  }
}
