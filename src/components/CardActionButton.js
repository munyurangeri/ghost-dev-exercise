import { html, delegateEvent } from "../lib";

const CardActionButton = ({
  id,
  selector,
  action,
  isDisabled = false,
  callback,
  className = "bg-[#262861] text-white  border-2 border-[#262861]",
}) => {
  const nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 md:size-10 lg:size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
</svg>
`;

  const previsousIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 md:size-10 lg:size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
`;

  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 md:size-10 lg:size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
`;

  const icon =
    action === "next"
      ? nextIcon
      : action === "previous"
      ? previsousIcon
      : closeIcon;

  const classes = `${selector} flex gap-2 p-[32px] lg:p-[16px] rounded-full ${className} ${
    !isDisabled ? "hover:text-[#262861] hover:bg-white" : ""
  }`;

  if (callback) {
    delegateEvent("click", `.${selector}`, callback);
  }

  return isDisabled
    ? html`<button
        id="${id}"
        aria-label="${action}"
        class="${classes}"
        disabled
      >
        ${icon}
      </button>`
    : html`<button id="${id}" aria-label="${action}" class="${classes}">
        ${icon}
      </button>`;
};

export default CardActionButton;
