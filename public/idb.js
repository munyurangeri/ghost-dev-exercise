// DATABASE - IndexedDB

// Open IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("stories-db", 3);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("failed to open database");

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      db.createObjectStore("cache", { keyPath: "url" });
      db.createObjectStore("post-requests", { autoIncrement: true });
      db.createObjectStore("reads", { keyPath: "id" });
    };
  });
}

async function saveReadsData(data) {
  const db = await openDatabase();
  const transaction = db.transaction("reads", "readwrite");
  const store = transaction.objectStore("reads");

  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject("failed to save all items, rolled back");
    transaction.oncomplete = () => resolve("all items saved successfully");

    data.forEach((item) => {
      const request = store.put(item);
      request.onerror = () =>
        reject(`Failed to save item: ${JSON.stringify(item)}`);
    });
  });
}

async function getAllReads() {
  const db = await openDatabase();
  const transaction = db.transaction("reads", "readwrite");
  const store = transaction.objectStore("reads");

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

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
