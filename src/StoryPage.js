import { html } from "./lib";
import StoryCard from "./components/StoryCard";
import StoryVideoCard from "./components/StoryVideoCard";

const StoryPage = () => {
  const markups = `
        <section class="w-full h-screen flex justify-center items-center gap-20">
            <div class="hidden xl:block">
                ${StoryCard({})}
            </div>
            ${StoryVideoCard({})}
        </section>
    `;

  return html`${markups}`;
};

export default StoryPage;
