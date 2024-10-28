import { html, delegateEvent } from "../lib";
import CardActionButton from "./CardActionButton";
import PrimaryButton from "./PrimaryButton";

const StoryCard = ({}) => {
  const markups = `
        <div class="flex flex-col w-full xl:w-[18.625rem] xl:h-[24.875rem]">
            <div class="hidden xl:flex gap-8 mb-8">
                ${CardActionButton({ action: "previous" })}          
                ${CardActionButton({ action: "next" })}
            </div>
            <div class="w-full px-0 xl:p-0">
                <h1 class="hidden xl:inline-block text-[46px] font-bold font-sans leading-[43px] tracking-tight mb-6">The Roberts Family's Story</h1>
                <p class="mb-12 lg:mb-7 text-lg md:text-3xl xl:text-base leading-[23px] font-normal ">
                    The circumstances that might leat to homelessness can include 
                    loss of income or transportation,
                    a falling out with loved ones, or an abrupt economic downturn.
                    For Brandon and Jennifer, it was all of these things.
                </p>
            </div>
            <div class="hidden xl:flex justify-start m-0">
                ${PrimaryButton({
                  id: "one",
                  tag: "button",
                  selector: "one",
                  label: "More Client Stories ",
                  callback: () => console.log("it deleguates to document!"),
                })}
            </div>
            <div class="flex justify-between mx-2 my-0 xl:hidden">
                ${CardActionButton({ action: "previous" })}                
                ${CardActionButton({ action: "next" })}
            </div>
        </div>
    `;

  return html`${markups}`;
};

export default StoryCard;
