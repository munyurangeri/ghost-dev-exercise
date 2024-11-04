const BASE_URL = "http://localhost:3000";
let wait; // TODO: clear timeout in terminate event or something like that

self.onmessage = function (event) {
  getData();
};

self.onerror = function (event) {
  console.error("Error in worker:", event.message);

  // Prevent the error from propagating to the main script (by returning true)
  return true;
};

function getData(
  result = { data: [], first: 1, items: -1, next: 1, pages: 0, prev: 0 }
) {
  console.log({ current: result });
  wait = setInterval(async () => {
    const nextPage = result.next || 1;
    const newResult = await reads(nextPage);
    console.log({ newResult });

    if (newResult?.data?.length) {
      self.postMessage(newResult.data);
      getData(newResult);
    } else getData();
  }, 60 * 1000);
}

async function reads(page = 1, per_page = 20) {
  try {
    const res = await fetch(
      `${BASE_URL}/reads?_page=${page}&_per_page=${per_page}`
    );

    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error("Something went wrong while fetching reads");
  }
}
