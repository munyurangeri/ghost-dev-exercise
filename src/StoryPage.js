import { html, reactive } from "./lib";
import StoryCard from "./components/StoryCard";
import StoryVideoCard from "./components/StoryVideoCard";
import Statistics from "./components/Statistics";

const BASE_URL = "http://localhost:3000";

const StoryPage = async () => {
  const imagesUrls = reactive([]);
  const statisticsData = reactive({});

  const statisticsWorker = new Worker("../workers/reads-statistics.js");
  statisticsWorker.postMessage({ action: "compute" });

  statisticsWorker.onmessage = function (event) {
    const { data } = event;

    if (data) statisticsData.set(data);
  };

  const markups = `
         ${Statistics({ data: statisticsData })}
        <section class="w-full max-h-screen lg:min-h-auto lg:max-h-none  flex flex-col-reverse xl:flex-row justify-center items-center gap-5 xl:gap-20 p-4">
            ${StoryCard({
              storyData: await getStory(),
              getNextRandomStory: getStory,
              statisticsWorker,
              imagesUrls,
            })}
            ${StoryVideoCard({ imagesUrls })}
        </section>
    `;

  return html`${markups}`;
};

async function getStory(lastId = 0, readId = 0) {
  let id = 0;

  while (!id || id === lastId) {
    id = Math.floor(Math.random() * 5) + 1;
  }

  if (id) {
    try {
      // const request = new Request(`${BASE_URL}/stories/${id}`);
      const data = await fetch(`${BASE_URL}/stories/${id}`).then((res) =>
        res.json()
      );

      const read = await addReadStat(data);

      if (readId)
        await fetch(`${BASE_URL}/reads/${readId}`, {
          method: "PATCH",
          body: JSON.stringify({
            end_reading_at: new Date(),
          }),
        });

      return { ...data, readId: read.id };
    } catch (error) {
      console.log({ getStoryError: error });
    }
  }
}

async function addReadStat(data) {
  const randomReader = Math.floor(Math.random() * 20) + 101;

  const response = await fetch(`${BASE_URL}/reads`, {
    method: "POST",
    body: JSON.stringify({
      story: data.family,
      start_reading_at: new Date(),
      end_reading_at: null,
      userId: randomReader.toString(),
    }),
  });

  return await response.json();
}

export default StoryPage;
