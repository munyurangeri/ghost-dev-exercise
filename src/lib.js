const eventListenersRegistry = [];

export function delegateEvent(type, selector, callback, parent = document) {
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      callback(event);
      eventListenersRegistry.push({ parent, type, callback });
    }
  });
}

export function clearEventListners() {
  eventListenersRegistry.forEach(({ element, type, callback }) => {
    element.removeEventListener(type, callback);
  });

  eventListenersRegistry.length = 0;
}

window.addEventListener("beforeunload", clearEventListners);

export function html([first, ...strings], ...values) {
  return values
    .reduce((acc, curr) => acc.concat(curr, strings.shift()), [first])
    .filter((x) => (x && x !== true) || x === 0)
    .join("");
}
