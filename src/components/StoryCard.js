import { html, delegateEvent } from "../lib";
import CardActionButton from "./CardActionButton";
import PrimaryButton from "./PrimaryButton";

const StoryCard = ({}) => {
  const markups = `
        <div class="xl:flex flex-col w-[18.625rem] xl:h-[24.875rem] rounded">
            <div class="hidden xl:flex gap-8 mb-8">
                ${CardActionButton({ action: "previous" })}          
                ${CardActionButton({ action: "next" })}
            </div>
            <div>
                <h1 class="hidden xl:inline-block text-[46px] font-bold font-sans leading-[43px] tracking-tight mb-6">The Roberts Family's Story</h1>
                <p class="mb-12 xl:mb-7 text-base font-normal leading-[23px]">
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
                ${CardActionButton({
                  action: "close",
                  className: "bg-red-500 text-white hover:shadow-lg",
                })}
                ${CardActionButton({ action: "next" })}
            </div>
        </div>
    `;

  return html`${markups}`;
};

export default StoryCard;
