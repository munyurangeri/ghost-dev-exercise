import { html, delegateEvent } from "../lib";

const CardActionButton = ({
  id,
  selector,
  action,
  callback,
  className = "bg-[#262861] text-white hover:shadow-lg",
}) => {
  const nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
</svg>
`;

  const previsousIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
`;

  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
`;

  const icon =
    action === "next"
      ? nextIcon
      : action === "previous"
      ? previsousIcon
      : closeIcon;

  const classes = `${selector} flex gap-2 w-8 h-8 p-2 rounded-full ${className}`;

  if (callback) {
    delegateEvent("click", `.${selector}`, callback);
  }

  return html`<button id="${id}" class="${classes}">${icon}</button> `;
};

export default CardActionButton;
