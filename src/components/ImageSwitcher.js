import { html, delegateEvent } from "../lib";

const ImageSwitcher = ({ id, selector, callback }) => {
  const classes = `${selector} w-3 h-3 bg-white rounded-full hover:bg-[#262861] cursor-pointer`;

  if (callback) {
    delegateEvent("click", `.${selector}`, callback);
  }

  return html`<span id="${id}" class="${classes}"></span>`;
};

export default ImageSwitcher;
