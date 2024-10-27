import { html } from "./lib";

import PrimaryButton from "./components/PrimaryButton";
import CardActionButton from "./components/CardActionButton";
import PlayButton from "./components/PlayButton";

const StoryPage = () => {
  const markups = `
        <section class="w-full h-screen flex justify-center items-center gap-20">
            <div class="hidden xl:block">
                <div class="xl:flex flex-col w-[18.625rem] xl:h-[24.875rem] rounded">
                    <div class="flex gap-8 mb-8">
                        ${CardActionButton({ action: "previous" })}          
                        ${CardActionButton({ action: "next" })}
                    </div>
                    <div>
                        <h1 class="text-[46px] font-bold font-sans leading-[43px] tracking-tight mb-6">The Roberts Family's Story</h1>
                        <p class="mb-7 text-base font-normal leading-[23px]">The circumstances that might leat to homelessness can include loss of income or transportation,
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
            </div>
            <div class="flex flex-col justify-center items-center gap-5  w-full h-screen xl:mt-[2.3555rem] xl:w-auto xl:h-auto">
                <div class="w-10/12 flex justify-between gap-4 xl:hidden">
                    <h1 class="text-[32px] font-bold font-sans leading-[32px] tracking-tight">
                        The Roberts Family's Story
                    </h1>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 ">
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                    </svg>

                </div>
                <div class="flex flex-col justify-center items-center w-10/12 xl:w-[52.688rem] h-3/6 xl:h-[29.586rem] bg-center bg-cover bg-no-repeat bg-[url('../data/images/pic-1.jpg')] rounded">
                     ${PlayButton({})}
                </div>
                <!-- TODO: Make scroll button component to replace these dots -->
                <div class="w-10/12 xl:w-full flex justify-start ">. . .</div>
                <div class="flex justify-center xl:mt-20 xl:hidden">
                    ${PrimaryButton({
                      id: "one",
                      tag: "button",
                      selector: "one",
                      label: "More Client Stories ",
                      callback: () => console.log("it deleguates to document!"),
                    })}
                </div>
            </div>
        </section>
    `;

  return html`${markups}`;
};

export default StoryPage;
