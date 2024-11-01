import { html, delegateEvent } from "../lib";

const PrimaryButton = ({
  id,
  selector,
  label,
  tag,
  href,
  callback,
  className = "bg-[#FFC840] text-[#262861] hover:animate-none motion-safe:animate-bounce",
}) => {
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:size-10 lg:size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
  </svg>`;

  const classes = `${selector}  flex gap-2 px-[32px] py-[16px] md:px-[48px] md:py-[32px] lg:px-[32px] lg:py-[16px] rounded-3xl font-mono text-base md:text-2xl lg:text-base font-medium leading-[1.125] ${className}`;

  if (tag.trim() === "button" && callback) {
    delegateEvent("click", `.${selector}`, callback);
  }

  return tag.trim() === "button"
    ? html`<button id="${id}" class="${classes}">${label} ${icon}</button> `
    : html`<a href="${href}" class="${classes} block"> ${label} ${icon}</a>`;
};

export default PrimaryButton;
