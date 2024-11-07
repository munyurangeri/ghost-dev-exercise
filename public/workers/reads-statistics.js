const BASE_URL = "http://localhost:3000";

self.onmessage = async function (event) {
  console.log({ event });
  const data = deduplicate(await reads());

  const statistics = {
    readsPerStory: computeReadsPerStory(data),
    mostReadStory: computeMostReadStory(data),
    storyReadAvarage: computeStoryReadAverage(data),
    totalReads: computeTotalReads(data),
    enthusiast: computeEnthusiast(data),
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

function deduplicate(rowData) {
  const data = Object.entries(rowData).map(([index, read]) => read);

  const dedups = data.reduce((acc, read) => {
    const key = read.id;
    if (!(key in acc)) acc[key] = read;

    return acc;
  }, {});

  return Object.values(dedups);
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

function computeTotalReads(rowData) {
  return Object.entries(rowData).length;
}

function computeEnthusiast(data) {
  const readsPerUser = Object.entries(data).reduce((reads, [_index, read]) => {
    const userIndex = Array.isArray(reads)
      ? reads.findIndex((el) => read.userId == el.userId)
      : -1;

    if (userIndex === -1)
      return [
        ...reads,
        {
          userId: read.userId,
          user: read.user,
          count: 1,
        },
      ];

    reads[userIndex] = {
      userId: read.userId,
      user: read.user,
      count: reads[userIndex].count + 1,
    };

    return reads;
  }, []);

  return readsPerUser.reduce(
    (enthusiast, { user, count }) => {
      return count > enthusiast.count
        ? { names: `${user.first_name} ${user.last_name}`, count }
        : enthusiast;
    },
    { names: null, count: 0 }
  );
}
