function reactivePrimitive(initialValue) {
  let value = initialValue;
  const observers = new Set();

  function notify() {
    observers.forEach((observer) => observer(value));
  }

  function set(newValue) {
    if (newValue !== value) {
      value = newValue;
      notify();
    }
  }

  function get() {
    return value;
  }

  function subscribe(callback) {
    observers.add(() => callback(value));

    return () => observers.delete(callback);
  }

  return { get, set, subscribe };
}

export function reactive(initialValue) {
  if (!Array.isArray(initialValue) || typeof initialValue !== "object")
    return reactivePrimitive(initialValue);
}

const eventListenersRegistry = [];

export function delegateEvent(type, selector, callback, parent = document) {
  console.log({ type, selector });
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

// window.addEventListener("beforeunload", clearEventListners);

export function html([first, ...strings], ...values) {
  return values
    .reduce((acc, curr) => acc.concat(curr, strings.shift()), [first])
    .filter((x) => (x && x !== true) || x === 0)
    .join("");
}

export function paginate(text, page = 1, characterPerPage = 212) {
  if (!text || !text.length) return "No story!";

  const startIndex = (page - 1) * characterPerPage;
  const endIndex = startIndex + characterPerPage;

  return text.substring(startIndex, endIndex);
}
