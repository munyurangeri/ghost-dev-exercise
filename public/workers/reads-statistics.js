const BASE_URL = "http://localhost:3000";

self.onmessage = async function (event) {
  const data = await reads();

  const statistics = {
    readsPerStory: computeReadsPerStory(data),
    mostReadStory: computeMostReadStory(data),
    storyReadAvarage: computeStoryReadAverage(data),
  };

  self.postMessage(statistics);
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

function computeReadsPerStory(rowData) {
  const data = Object.entries(rowData).map(([index, read]) => read);

  return data.reduce((acc, { story }) => {
    const key = story.trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function computeMostReadStory(data) {
  const readsPerStory = computeReadsPerStory(data);

  return Object.entries(readsPerStory).reduce(
    (max, [story, count]) => {
      return count > max.count ? { story, count } : max;
    },
    { story: null, count: 0 }
  );
}

function computeStoryReadAverage(data) {
  const readsPerStory = Object.entries(computeReadsPerStory(data));

  const total = readsPerStory.reduce(
    (total, [story, count]) => total + count,
    0
  );

  return total > 0 ? Math.round(total / readsPerStory.length + 1) : 0;
}
