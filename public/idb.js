// DATABASE - IndexedDB

// Open IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("stories-db", 1);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("failed to open database");

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      db.createObjectStore("cache", { keyPath: "url" });
      db.createObjectStore("post-requests", { autoIncrement: true });
    };
  });
}

// Save data to IndexedDB
async function saveToCache(url, data) {
  const db = await openDatabase();
  const transaction = db.transaction("cache", "readwrite");
  const store = transaction.objectStore("cache");

  return new Promise((resolve, reject) => {
    const request = store.put({ url, data });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Retrieve data from IndexedDB
async function getCachedData(url) {
  const db = await openDatabase();
  const transaction = db.transaction("cache", "readonly");
  const store = transaction.objectStore("cache");

  return new Promise((resolve, reject) => {
    const request = store.get(url);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save offline POST request
async function saveOfflinePostRequest(url, body) {
  const db = await openDatabase();
  const transaction = db.transaction("post-requests", "readwrite");
  const store = transaction.objectStore("post-requests");

  return new Promise((resolve, reject) => {
    const request = store.add({ url, body });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Retrieve and clear all offline POST requests
async function getAndClearOfflinePostRequests() {
  const db = await openDatabase();
  const transaction = db.transaction("post-requests", "readwrite");
  const store = transaction.objectStore("post-requests");

  const allRequests = await new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  await new Promise((resolve, reject) => {
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  return allRequests;
}
