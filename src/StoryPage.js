import { html, reactive } from "./lib";
import { getStory, getReadStats, addReadStat, updateReadStat } from "./api";
import StoryCard from "./components/StoryCard";
import StoryVideoCard from "./components/StoryVideoCard";
import Statistics from "./components/Statistics";
import FeatureEnabled from "./components/FeatureEnabled";
import { analyticsActions } from "./workersActions";

const StoryPage = async ({ analyticsWorker }) => {
  const imagesUrls = reactive([]);
  const statisticsData = reactive({});

  const [_, data] = await getReadStats();

  analyticsWorker.postMessage({
    action: analyticsActions.COMPUTE_ALL,
    reads: data,
  });

  analyticsWorker.onmessage = function (event) {
    const { data } = event;

    if (data) statisticsData.set(data);
  };

  const markups = `
         ${FeatureEnabled({
           featureFlag: "statistics",
           child: Statistics({ data: statisticsData }),
         })}
        <section class="w-full max-h-screen lg:min-h-auto lg:max-h-none flex flex-col-reverse xl:flex-row justify-center items-center gap-5 xl:gap-20 p-4">
            ${StoryCard({
              storyData: await getStoryAndUpdateReadStats(),
              getNextRandomStory: getStoryAndUpdateReadStats,
              statisticsWorker: analyticsWorker,
              imagesUrls,
            })}
            ${StoryVideoCard({ imagesUrls })}
        </section>
    `;

  return html`${markups}`;
};

async function getStoryAndUpdateReadStats(lastId = 0, readId = 0) {
  let id = 0;

  while (!id || id === lastId) {
    id = Math.floor(Math.random() * 5) + 1;
  }

  if (id) {
    const [_, data] = await getStory(id);
    const [_addReadStatError, read] = await addReadStat(data);

    if (readId) updateReadStat(readId);

    return { ...data, readId: read.id };
  }
}

export default StoryPage;
