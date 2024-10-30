import { html, delegateEvent, reactive } from "../lib";
import PlayButton from "./PlayButton";
import ImageSwitcher from "./ImageSwitcher";

const StoryVideoCard = ({}) => {
  const imagesUrls = [
    "../../data/images/pic-1.jpg",
    "../../data/images/pic-2.jpg",
    "../../data/images/pic-1.jpg",
  ];

  const imagesMarkup = imagesUrls
    .map((imageUrl) => {
      return `<img src="${imageUrl}" class="w-full xl:w-11/12 h-auto xl:h-[29.586rem] flex-none rounded snap-center" />`;
    })
    .join(" ");

  const storyImages = `
    <div class="relative">
      <div class="w-full xl:w-[50rem] overflow-x-auto scrollbar-hidden">
        <div class="flex flex-nowrap space-x-4 xl:space-x-8 snap-x">
          ${imagesMarkup}
        </div>
      </div>
      <div class="absolute inset-0 flex justify-center items-center pointer-events-none">
        ${PlayButton({})}
      </div>
    </div>
  `;

  const storyImagesSwitchButtons = imagesUrls
    .map((imageUrl, index) => {
      return `${ImageSwitcher({
        selector: `switcher-${index}`,
      })}`;
    })
    .join(" ");

  const markups = `
    <div class="flex flex-col justify-center items-center gap-5 w-auto h-auto xl:mt-[2.3555rem]">
      <div id="card-body" class="rounded overflow-hidden">
        ${storyImages}        
      </div>
      <div id="images-switcher" class="flex justify-center xl:justify-start gap-2 w-full xl:mt-2">
        ${storyImagesSwitchButtons}
      </div>
    </div>`;

  return html`${markups}`;
};

export default StoryVideoCard;
