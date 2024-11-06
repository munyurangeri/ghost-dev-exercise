import { html } from "../lib";
import PlayButton from "./PlayButton";
import ImageSwitcher from "./ImageSwitcher";

const StoryImages = (imagesUrls) => {
  const markups = `
    <div class="relative">
      <div class="w-full xl:w-[50rem] overflow-x-auto scrollbar-hidden">
        <div class="flex flex-nowrap space-x-4 xl:space-x-8 snap-x">
          ${imagesMarkup(imagesUrls)}
        </div>
      </div>
      <div
        class="absolute inset-0 flex justify-center items-center pointer-events-none"
      >
        ${PlayButton({})}
      </div>
    </div>
  `;

  return html`${markups}`;
};

const StoryVideoCard = ({ imagesUrls }) => {
  const markups = `<div
    class="flex flex-col justify-center items-center gap-4 w-auto h-auto xl:mt-[2.3555rem]"
  >
    <div id="card-body" class="rounded overflow-hidden">
      ${StoryImages(imagesUrls)}
    </div>
    <div
      id="images-switcher"
      class="flex justify-center xl:justify-start gap-2 w-full xl:mt-2"
    >
      ${createImagesSwitchButtons(imagesUrls)}
    </div>
  </div>`;

  imagesUrls.subscribe((urls) => {
    document.getElementById("card-body").innerHTML = html`${StoryImages(urls)}`;

    document.getElementById(
      "images-switcher"
    ).innerHTML = html`${createImagesSwitchButtons(urls)}`;
  });

  return html`${markups}`;
};

function urls(imagesUrls) {
  return imagesUrls && imagesUrls.length
    ? imagesUrls
    : ["https://placehold.co/600x400?text=Upload+Picture&font=roboto"];
}

function imagesMarkup(imagesUrls) {
  const markups = urls(imagesUrls).map((imageUrl) => {
    return `<img src="${imageUrl}" alt="family picture" class="w-full xl:w-11/12 h-52 md:h-[29.586rem] xl:h-[29.586rem] flex-none rounded snap-center" />`;
  });

  return html`${markups}`;
}

function createImagesSwitchButtons(imagesUrls) {
  const markups = urls(imagesUrls).map((imageUrl, index) => {
    return `${ImageSwitcher({
      selector: `switcher-${index}`,
    })}`;
  });

  return html`${markups}`;
}

export default StoryVideoCard;
