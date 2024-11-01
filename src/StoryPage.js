import { html } from "./lib";
import StoryCard from "./components/StoryCard";
import StoryVideoCard from "./components/StoryVideoCard";

const StoryPage = () => {
  const markups = `
        <section class="w-full h-screen flex flex-col-reverse xl:flex-row justify-center items-center gap-10 xl:gap-20 p-4">          
            ${StoryCard({})}
            ${StoryVideoCard({})}
        </section>
    `;

  return html`${markups}`;
};

export default StoryPage;
