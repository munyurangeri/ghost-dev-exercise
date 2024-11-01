import { html, delegateEvent, reactive } from "../lib";
import PlayButton from "./PlayButton";
import ImageSwitcher from "./ImageSwitcher";

const StoryVideoCard = ({ imagesUrls }) => {
  const urls = (imagesUrls) =>
    imagesUrls && imagesUrls.length
      ? imagesUrls
      : ["http://localhost:3000/images/no-image.jpg"];

  imagesUrls.subscribe((urls) => {
    document.getElementById("card-body").innerHTML = html`${storyImages(urls)}`;
    document.getElementById(
      "images-switcher"
    ).innerHTML = html`${storyImagesSwitchButtons(urls)}`;
  });

  const imagesMarkup = (imagesUrls) =>
    urls(imagesUrls).map((imageUrl) => {
      return `<img src="${imageUrl}" class="w-full xl:w-11/12 h-52 md:h-[29.586rem] xl:h-[29.586rem] flex-none rounded snap-center" />`;
    });

  const storyImages = (imagesUrls) => `
    <div class="relative">
      <div class="w-full xl:w-[50rem] overflow-x-auto scrollbar-hidden">
        <div class="flex flex-nowrap space-x-4 xl:space-x-8 snap-x">
          ${imagesMarkup(imagesUrls)}
        </div>
      </div>
      <div class="absolute inset-0 flex justify-center items-center pointer-events-none">
        ${PlayButton({})}
      </div>
    </div>
  `;

  const storyImagesSwitchButtons = (imagesUrls) => {
    return urls(imagesUrls).map((imageUrl, index) => {
      return `${ImageSwitcher({
        selector: `switcher-${index}`,
      })}`;
    });
  };

  return html`<div
    class="flex flex-col justify-center items-center gap-4 w-auto h-auto xl:mt-[2.3555rem]"
  >
    <div id="card-body" class="rounded overflow-hidden">
      ${storyImages(imagesUrls)}
    </div>
    <div
      id="images-switcher"
      class="flex justify-center xl:justify-start gap-2 w-full xl:mt-2"
    >
      ${storyImagesSwitchButtons(imagesUrls)}
    </div>
  </div>`;
};

export default StoryVideoCard;
