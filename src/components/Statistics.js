import { html, formatNumber } from "../lib";

const cardStyles =
  "bg-[#262861] font-mono text-white h-28 w-40 rounded-lg shadow-2xl flex flex-col justify-center items-center py-4";

const cardHeaderStyles = "mb-2 text-[#FFC840] text-xs font-thin block";

const StoryReadAverage = ({ storyReadAvarage }) => {
  console.log({ storyReadAvarage });
  const markups = `
    <div class="${cardStyles}">
      <span class="${cardHeaderStyles}">Avg. Reads / Story</span>
            
      <span class="text-3xl font-bold my-2">
        ${storyReadAvarage ? formatNumber(storyReadAvarage) : 0}
      </span>

    </div>
  `;

  return markups;
};

const MostReadStory = ({ mostReadStory }) => {
  const markups = `
    <div class="${cardStyles}">
      <span class="${cardHeaderStyles}">Most Read Story</span>

      <span class="text-base font-semibold uppercase text-[#F15C22]">
        ${mostReadStory?.story ? mostReadStory.story : ""}
      </span>
      <span class="text-2xl font-bold">
        ${mostReadStory?.count ? formatNumber(mostReadStory.count) : ""}
      </span>
    </div>
  `;

  return markups;
};

const Statistics = ({ data }) => {
  const markups = `
    <section id="statistics-panel" class="w-full my-4 flex justify-center items-center gap-2 lg:gap-6 text-white">
      ${createSubComponents([StoryReadAverage, MostReadStory], data.get())}
    </section>`;

  const wait = setInterval(() => {
    console.log("waiting...");
    const panel = document.getElementById("statistics-panel");
    console.log(data.get());

    if (panel) {
      clearInterval(wait);
      panel.innerHTML = createSubComponents(
        [StoryReadAverage, MostReadStory],
        data.get()
      );
    }
  }, 100);

  data.subscribe((value) => {
    document.getElementById("statistics-panel").innerHTML = createSubComponents(
      [StoryReadAverage, MostReadStory],
      value
    );
  });

  return html`${markups}`;
};

function createSubComponents(components, dataForSubComponents) {
  console.log({ dataForSubComponents });
  return html`${components.map((component) =>
    component(dataForSubComponents)
  )}`;
}

export default Statistics;
