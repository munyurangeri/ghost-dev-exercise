import { html, delegateEvent, reactive } from "../lib";
import PrimaryButton from "./PrimaryButton";
import PlayButton from "./PlayButton";
import StoryCard from "./StoryCard";
import ImageSwitcher from "./ImageSwitcher";

const StoryVideoCard = ({}) => {
  const storyImages = `
    <div class="relative w-full xl:w-[50rem] px-4 xl:px-0">
      <div class="flex overflow-x-hidden space-x-6 max-w-full snap-mandatory snap-x">
        <img src="../../data/images/pic-1.jpg" class="w-auto h-auto xl:h-[29.586rem] rounded snap-center" />
        <img src="../../data/images/pic-2.jpg" class="w-auto h-auto xl:h-[29.586rem] rounded snap-center" />
        <img src="../../data/images/pic-1.jpg" class="w-auto h-auto xl:h-[29.586rem] rounded snap-center" />
          </div>
          <div class="absolute inset-0 flex justify-center items-center">
            ${PlayButton({})}
          </div>
        </div>
  `;

  const storyImagesSwitchButtons = `
              ${ImageSwitcher({
                selector: "one",
              })}
              ${ImageSwitcher({
                selector: "one",
              })}
              ${ImageSwitcher({
                selector: "one",
              })}
  `;

  const markups = `
    <div class="flex flex-col justify-center items-center gap-5 w-full h-screen xl:mt-[2.3555rem] xl:w-auto xl:h-auto">            
      <div class="w-10/12 flex justify-between gap-4 xl:hidden">
        <h1 class="text-[32px] font-bold font-sans leading-[32px] tracking-tight">
          The Roberts Family's Story
        </h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  class="show-story-card-ctl size-8 text-[#262861]">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
        </svg>
      </div>
      <div id="card-body">
        ${storyImages}       
        
        
      </div>
            
      <div id="images-switcher" class="flex justify-start gap-2 px-4 xl:px-0 w-full z-10">
        ${storyImagesSwitchButtons}
      </div>
        <div class="flex justify-center mt-10 xl:hidden">
          ${PrimaryButton({
            id: "one",
            tag: "button",
            selector: "one",
            label: "More Client Stories ",
            callback: () => console.log("it deleguates to document!"),
          })}
        </div>
    </div> 
    `;

  const isStoryCardVisible = reactive(false);

  isStoryCardVisible.subscribe((value) => {
    const cardBodyDiv = document.getElementById("card-body");
    const imagesSwitcherDiv = document.getElementById("images-switcher");

    if (!value) {
      cardBodyDiv.innerHTML = storyImages;
      imagesSwitcherDiv.innerHTML = storyImagesSwitchButtons;
    } else {
      cardBodyDiv.innerHTML = StoryCard({});
      imagesSwitcherDiv.innerHTML = "";
    }
  });

  delegateEvent("click", ".show-story-card-ctl", () => {
    isStoryCardVisible.set(!isStoryCardVisible.get());
  });

  return html`${markups}`;
};

export default StoryVideoCard;
