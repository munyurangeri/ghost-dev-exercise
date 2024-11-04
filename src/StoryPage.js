import { html, reactive } from "./lib";
import StoryCard from "./components/StoryCard";
import StoryVideoCard from "./components/StoryVideoCard";

const BASE_URL = "http://localhost:3000";

const StoryPage = async () => {
  const getStory = async (lastId = 0) => {
    let id = 0;

    while (!id || id === lastId) {
      id = Math.floor(Math.random() * 5) + 1;
    }

    if (id) {
      try {
        const request = new Request(`${BASE_URL}/stories/${id}`);
        const response = await fetch(request);
        const data = await response.json();

        await fetch(`${BASE_URL}/reads`, {
          method: "POST",
          body: JSON.stringify({
            story: data.family,
            read_at: new Date(),
          }),
        });

        return data;
      } catch (error) {
        console.log({ getStoryError: error });
      }
    }
  };

  const imagesUrls = reactive([]);

  const markups = `
        <section class="w-full h-auto xl:h-screen flex flex-col-reverse xl:flex-row justify-center items-center gap-5 xl:gap-20 p-4 md:p-10">          
            ${StoryCard({
              storyData: await getStory(),
              getNextRandomStory: getStory,
              imagesUrls: imagesUrls,
            })}
            ${StoryVideoCard({ imagesUrls })}
        </section>
    `;

  return html`${markups}`;
};

export default StoryPage;
