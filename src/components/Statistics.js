import { html, formatNumber } from "../lib";

const cardStyles =
  "bg-[#262861] font-mono text-white h-28 w-44 md:w-52 rounded-lg shadow-2xl flex flex-col justify-center items-center p-4";

const cardHeaderStyles =
  "block w-full mb-2 px-2 text-[#FFC840] text-xs font-thin tracking-tighter";

const TotalReads = ({ totalReads }) => {
  const markups = `
    <div class="${cardStyles}">
      <span class="${cardHeaderStyles}">Total Reads</span>
            
      <span class="text-2xl font-bold mb-6">
        ${totalReads ? formatNumber(totalReads) : 0}
      </span>

    </div>
  `;

  return markups;
};

const StoryReadAverage = ({ storyReadAvarage }) => {
  const markups = `
    <div class="${cardStyles}">
      <span class="${cardHeaderStyles}">Avg. Reads/Story</span>
            
      <span class="text-2xl font-bold mb-6">
        ${storyReadAvarage ? formatNumber(storyReadAvarage) : 0}
      </span>

    </div>
  `;

  return markups;
};

const MostReadStory = ({ mostReadStory }) => {
  const format = (mostReadStory) => {
    const value = `${
      mostReadStory?.count ? formatNumber(mostReadStory.count) : "No read"
    }`;

    const label = `<span class=""> ${
      mostReadStory?.count > 1
        ? "times"
        : mostReadStory?.count === 1
        ? "time"
        : "yet!"
    }</span>`;

    return `x${value}`;
  };

  const markups = `
    <div class="${cardStyles}">
      <span class="${cardHeaderStyles}">Most Read Story</span>     

      <span class="text-base md:text-xl font-semibold uppercase mb-6">
        ${mostReadStory?.story ? mostReadStory.story : ""} 
        <span class="text-xs font-light text-nowrap tracking-tighter capitalize text-[#F15C22]">
          ${format(mostReadStory)}
        </span>
      </span>
      </span>
    </div>
  `;

  return markups;
};

const Enthusiast = ({ enthusiast }) => {
  const markups = `
    <div class="${cardStyles}">
      <span class="${cardHeaderStyles}">Enthusiast</span>

      <span class="text-2xl font-bold tracking-tighter mb-2">
        ${
          enthusiast?.count ? enthusiast.count : 0
        } <span class="text-xs font-light">Stories</span>
      </span>

      <span class="text-sm font-semibold capitalize tracking-tight text-[#F15C22]">
        ${enthusiast?.names ? enthusiast.names : "&nbsp;"}
      </span>
    </div>
  `;

  return markups;
};

const Statistics = ({ data }) => {
  const markups = `
    <section id="statistics-panel" class="w-full my-4 flex justify-center items-center flex-wrap gap-2 lg:gap-6 text-white hover:bg-[#F15C22] lg:py-4">
      ${createSubComponents(
        [TotalReads, StoryReadAverage, MostReadStory, Enthusiast],
        data.get()
      )}
    </section>`;

  const wait = setInterval(() => {
    const panel = document.getElementById("statistics-panel");

    if (panel) {
      clearInterval(wait);
      panel.innerHTML = createSubComponents(
        [TotalReads, StoryReadAverage, MostReadStory, Enthusiast],
        data.get()
      );

      data.subscribe((value) => {
        panel.innerHTML = createSubComponents(
          [TotalReads, StoryReadAverage, MostReadStory, Enthusiast],
          value
        );
      });
    }
  }, 100);

  return html`${markups}`;
};

function createSubComponents(components, dataForSubComponents) {
  // console.log({ dataForSubComponents });
  return html`${components.map((component) =>
    component(dataForSubComponents)
  )}`;
}

export default Statistics;
