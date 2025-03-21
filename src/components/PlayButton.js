import { html, delegateEvent } from "../lib";

const PlayButton = ({
  id,
  selector,
  callback,
  className = "bg-[#F15C22] text-white hover:shadow-lg",
}) => {
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
</svg>`;

  const classes = `${selector} pointer-events-auto 
    flex justify-center items-center
    w-[68px] h-10 p-2 rounded ${className}
    transition ease-in-out delay-75
    hover:-translate-y-1 hover:scale-110 duration-150`;

  if (callback) {
    delegateEvent("click", `.${selector}`, callback);
  }

  return html`<button id="${id}" aria-label="Play" class="${classes}">
    ${icon}
  </button> `;
};

export default PlayButton;
