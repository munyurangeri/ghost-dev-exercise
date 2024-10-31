import { html, paginate } from "../lib";
import CardActionButton from "./CardActionButton";
import PrimaryButton from "./PrimaryButton";

const StoryCard = ({ story }) => {
  const markups = `
        <div class="flex flex-col w-full xl:w-[18.625rem] xl:h-[24.875rem]">
            <div class="hidden xl:flex gap-8 mb-8">
                ${CardActionButton({ action: "previous" })}          
                ${CardActionButton({ action: "next" })}
            </div>
            <div class="w-full mb-8 px-0 xl:px-0">
                <h1 class="inline-block font-bold font-sans text-3xl lg:text-[46px] leading-3xl lg:leading-[43px] tracking-tight mb-4 xl:mb-6">The Roberts Family's Story</h1>
                <p class=" text-lg md:text-3xl xl:text-base leading-[23px] font-normal ">
                    ${paginate(story)}
                </p>
            </div>

            <div class="flex justify-center gap-8 mx-2 mb-8 xl:hidden">
                ${CardActionButton({ action: "previous" })}                
                ${CardActionButton({ action: "next" })}
            </div>

            <div class="flex justify-center xl:justify-start m-0">
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

  return html`${markups}`;
};

export default StoryCard;
