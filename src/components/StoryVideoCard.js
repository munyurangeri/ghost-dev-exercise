import { html, delegateEvent, reactive } from "../lib";
import PrimaryButton from "./PrimaryButton";
import PlayButton from "./PlayButton";
import StoryCard from "./StoryCard";
import ImageSwitcher from "./ImageSwitcher";

const StoryVideoCard = ({}) => {
  const imagesUrls = [
    "../../data/images/pic-1.jpg",
    "../../data/images/pic-2.jpg",
    "../../data/images/pic-1.jpg",
  ];

  const imagesMarkup = imagesUrls
    .map((imageUrl) => {
      return `<img src="${imageUrl}" class="w-11/12 xl:w-auto h-auto xl:h-[29.586rem] flex-none rounded snap-center" />`;
    })
    .join(" ");

  const storyImages = `
    <div class="relative">
      <div class="w-full xl:w-[50rem] overflow-x-auto scrollbar-hidden">
        <div class="flex flex-nowrap space-x-2 xl:space-x-8 snap-x">
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
    <div class="flex flex-col justify-center items-center gap-5 w-full h-screen xl:mt-[2.3555rem] xl:w-auto xl:h-auto">            
      <div class="w-full px-4 flex justify-between gap-4 xl:hidden show-story-card-ctl">
        <h1 class="text-4xl leading-4xl md:text-6xl md:leading-6xl font-bold font-sans tracking-tight show-story-card-ctl">          
          The Roberts Family's Story
        </h1>
        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  class="size-8 text-[#262861] show-story-card-ctl">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
        </svg> -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-[#262861] show-story-card-ctl">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
        </svg>


      </div>
      <div id="card-body" class="px-4 transition-all duration-300 ease-in-out translate-y-0">
        ${storyImages}        
      </div>
            
      <div id="images-switcher" class="flex justify-start gap-2 px-4 w-full z-10">
        ${storyImagesSwitchButtons}
      </div>
        <div class="flex justify-center mt-10 xl:hidden">
          ${PrimaryButton({
            id: "one",
            tag: "button",
            selector: "one",
            label: "More Client Stories ",
            callback: () => console.log("Navigating to stories page..."),
          })}
        </div>
    </div> 
    `;

  const isStoryCardVisible = reactive(false);

  isStoryCardVisible.subscribe((value) => {
    const cardBodyDiv = document.getElementById("card-body");
    const imagesSwitcherDiv = document.getElementById("images-switcher");

    cardBodyDiv.classList.add("translate-y-12");

    const wait = setTimeout(() => {
      clearTimeout(wait);

      if (!value) {
        cardBodyDiv.innerHTML = storyImages;
        imagesSwitcherDiv.innerHTML = storyImagesSwitchButtons;
      } else {
        cardBodyDiv.innerHTML = StoryCard({});
        imagesSwitcherDiv.innerHTML = "";
      }

      cardBodyDiv.classList.remove("translate-y-12");
      cardBodyDiv.classList.add("translate-y-0");
    }, 300);
  });

  delegateEvent("click", ".show-story-card-ctl", () => {
    isStoryCardVisible.set(!isStoryCardVisible.get());
  });

  return html`${markups}`;
};

export default StoryVideoCard;