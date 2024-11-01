import { html, reactive } from "./lib";
import StoryCard from "./components/StoryCard";
import StoryVideoCard from "./components/StoryVideoCard";

const StoryPage = async () => {
  const getStory = async () => {
    const id = Math.floor(Math.random() * 5) + 1;
    return await fetch(`http://localhost:3000/stories/${id}`).then((res) =>
      res.json()
    );
  };

  const imagesUrls = reactive([]);

  const markups = `
        <section class="w-full h-auto xl:h-screen flex flex-col-reverse xl:flex-row justify-center items-center gap-5 xl:gap-20 p-4">          
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
