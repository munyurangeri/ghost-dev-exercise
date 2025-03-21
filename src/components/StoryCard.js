/* eslint-disable no-unused-vars */
import { getReadStats } from "../api";
import { html, paginate, reactive } from "../lib";
import CardActionButton from "./CardActionButton";
import PrimaryButton from "./PrimaryButton";
import { analyticsActions } from "../workersActions";

const StoryCard = ({
  storyData,
  getNextRandomStory,
  statisticsWorker,
  imagesUrls,
}) => {
  const { id, family, story, images, readId } = storyData;

  const wait = setTimeout(() => {
    clearTimeout(wait);

    imagesUrls.set(images);
  }, 1000);

  const previousButtonSelector = "card-previous";
  const nextButtonSelector = "card-next";

  const currentId = reactive(id);
  const currentReadId = reactive(readId);
  const currentFamily = reactive(family);
  const currentStory = reactive(story);

  const { pageText, nextPage, previousPage } = paginate(currentStory.get());
  const text = reactive(pageText);
  const next = reactive(nextPage);
  const previous = reactive(previousPage);

  currentFamily.subscribe((value) => {
    document.getElementById(
      "family-name"
    ).innerHTML = `The ${value} Family's Story`;
  });

  text.subscribe((value) => {
    const pane = document.getElementById("story-text-pane");
    pane.classList.add("-translate-y-full");

    const wait = setTimeout(() => {
      clearTimeout(wait);
      document.getElementById("story-text").innerHTML = value;
      pane.classList.remove("-translate-y-full");
    }, 500);
  });

  next.subscribe((value) => {
    const buttons = document.querySelectorAll(`.${nextButtonSelector}`);

    buttons.forEach((button) => {
      if (value <= 0) {
        button.setAttribute("disabled", "");
        button.classList.remove("hover:text-[#262861]", "hover:bg-white");
      } else {
        button.removeAttribute("disabled");
        button.classList.add("hover:text-[#262861]", "hover:bg-white");
      }
    });
  });

  previous.subscribe((value) => {
    const buttons = document.querySelectorAll(`.${previousButtonSelector}`);

    buttons.forEach((button) => {
      if (value <= 0) {
        button.setAttribute("disabled", "");
        button.classList.remove("hover:text-[#262861]", "hover:bg-white");
      } else {
        button.removeAttribute("disabled");
        button.classList.add("hover:text-[#262861]", "hover:bg-white");
      }
    });
  });

  const handlePrevious = () => {
    const { pageText, nextPage, previousPage } = paginate(
      currentStory.get(),
      previous.get()
    );
    next.set(nextPage);
    previous.set(previousPage);
    text.set(pageText);
  };

  const handleNext = () => {
    const { pageText, nextPage, previousPage } = paginate(
      currentStory.get(),
      next.get()
    );
    next.set(nextPage);
    previous.set(previousPage);
    text.set(pageText);
  };

  const handleGetNextStory = () => {
    const pane = document.getElementById("story-pane");
    pane.classList.add("-translate-y-full");

    const wait = setTimeout(async () => {
      clearTimeout(wait);

      const { id, family, story, images, readId } = await getNextRandomStory(
        currentId.get(),
        currentReadId.get()
      );

      currentId.set(id);
      currentReadId.set(readId);
      currentFamily.set(family);
      currentStory.set(story);
      imagesUrls.set(images);

      const { pageText, nextPage, previousPage } = paginate(currentStory.get());

      text.set(pageText);
      next.set(nextPage);
      previous.set(previousPage);

      // Update statistics
      const [_, data] = await getReadStats();
      statisticsWorker.postMessage({
        action: analyticsActions.COMPUTE_ALL,
        reads: data,
      });

      pane.classList.remove("-translate-y-full");
    }, 700);
  };

  const markups = `
            <div class="flex flex-col w-full xl:w-[18.625rem] xl:h-[24.875rem]">
                <div class="flex flex-col-reverse xl:flex-col">
                    <div class="flex justify-center xl:justify-start gap-8 mb-6">
                        ${CardActionButton({
                          id: previousButtonSelector,
                          action: "previous",
                          selector: previousButtonSelector,
                          isDisabled: true,
                          callback: handlePrevious,
                        })}          
                        ${CardActionButton({
                          id: nextButtonSelector,
                          action: "next",
                          selector: nextButtonSelector,
                          callback: handleNext,
                        })}
                    </div>
                    <div class="w-full h-62 xl:mb-4 overflow-hidden">
                        <div id="story-pane" class="w-full mb-0 px-0 xl:px-0 overflow-hidden transition-all duration-500 ease-in-out ">
                            <h1 id="family-name" class="inline-block font-bold font-sans text-3xl lg:text-[46px] leading-3xl lg:leading-[43px] tracking-tight mb-4 xl:mb-6">
                                The ${currentFamily.get()} Family's Story
                            </h1>
                            <div class="h-48 overflow-hidden">
                                <div id="story-text-pane" class="transition-all duration-500 ease-in-out">
                                    <p id="story-text" class="text-base md:text-3xl xl:text-base leading-[23px] font-light lg:font-normal">
                                        ${text.get()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center xl:justify-start m-2 md:mt-24 lg:mt-2">
                    ${PrimaryButton({
                      id: "get-next-random-story",
                      tag: "button",
                      selector: "get-next-random-story",
                      label: "Next Client Story ",
                      callback: handleGetNextStory,
                    })}
                </div>
            </div>
        `;

  return html`${markups}`;
};

export default StoryCard;
