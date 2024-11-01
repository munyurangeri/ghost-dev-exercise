import { html, paginate, reactive, delegateEvent } from "../lib";
import CardActionButton from "./CardActionButton";
import PrimaryButton from "./PrimaryButton";

const StoryCard = ({ storyData, getNextRandomStory, imagesUrls }) => {
  const { family, story, images } = storyData;

  const wait = setTimeout(() => {
    imagesUrls.set(images);
    clearTimeout(wait);
  }, 1000);

  const { pageText, nextPage, previousPage } = paginate(story);
  const previousButtonSelector = "card-previous";
  const nextButtonSelector = "card-next";

  const familyName = reactive(family);
  const text = reactive(pageText);
  const next = reactive(nextPage);
  const previous = reactive(previousPage);

  familyName.subscribe((value) => {
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
      if (value <= 0) button.setAttribute("disabled", "");
      else button.removeAttribute("disabled");
    });
  });

  previous.subscribe((value) => {
    const buttons = document.querySelectorAll(`.${previousButtonSelector}`);

    buttons.forEach((button) => {
      if (value <= 0) button.setAttribute("disabled", "");
      else button.removeAttribute("disabled");
    });
  });

  // FIXME: Ensure handles for next and previous use the current story

  const handlePrevious = () => {
    const { pageText, nextPage, previousPage } = paginate(
      story,
      previous.get()
    );
    next.set(nextPage);
    previous.set(previousPage);
    text.set(pageText);
  };

  const handleNext = () => {
    const { pageText, nextPage, previousPage } = paginate(story, next.get());
    next.set(nextPage);
    previous.set(previousPage);
    text.set(pageText);
  };

  const handleGetNextStory = async () => {
    const { family, story, images } = await getNextRandomStory();
    const { pageText, nextPage, previousPage } = paginate(story);

    const pane = document.getElementById("story-pane");
    pane.classList.add("-translate-y-full");

    const wait = setTimeout(() => {
      clearTimeout(wait);

      text.set(pageText);
      next.set(nextPage);
      previous.set(previousPage);
      familyName.set(family);
      imagesUrls.set(images);
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
                    <div class="w-full h-64 xl:mb-4  overflow-hidden">
                        <div id="story-pane" class="w-full mb-0 px-0 xl:px-0 overflow-hidden transition-all duration-500 ease-in-out translate-y-0">
                            <h1 id="family-name" class="inline-block font-bold font-sans text-3xl lg:text-[46px] leading-3xl lg:leading-[43px] tracking-tight mb-4 xl:mb-6">
                                The ${familyName.get()} Family's Story
                            </h1>
                            <div class="h-40 overflow-hidden">
                                <div id="story-text-pane" class="transition-all duration-500 ease-in-out">
                                    <p id="story-text" class="text-lg md:text-3xl xl:text-base leading-[23px] font-normal ">
                                        ${text.get()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center xl:justify-start m-2">
                    ${PrimaryButton({
                      id: "get-next-random-story",
                      tag: "button",
                      selector: "get-next-random-story",
                      label: "More Client Stories ",
                      callback: handleGetNextStory,
                    })}
                </div>
            </div>
        `;

  return html`${markups}`;
};

export default StoryCard;
