const BASE_URL = "http://localhost:3000";

self.onmessage = async function (event) {
  const data = await reads();

  self.postMessage(data);
};

self.onerror = function (event) {
  console.error("Error in worker:", event.message);

  // Prevent the error from propagating to the main script (by returning true)
  return true;
};

async function reads() {
  try {
    const request = new Request(`${BASE_URL}/reads?_embed=user`);
    const res = await fetch(request);

    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error("Something went wrong while fetching reads");
  }
}
