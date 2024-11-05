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

function reactiveArray(initialArray) {
  const reactive = reactivePrimitive(initialArray);

  const handler = {
    get(target, prop) {
      if (prop === "subscribe") {
        return reactive.subscribe;
      }

      if (prop === "set") {
        return reactive.set;
      }

      return target[prop];
    },

    set(target, prop, value) {
      target[prop] = value;
      reactive.set(target);
    },
  };

  return new Proxy(initialArray, handler);
}

function reactiveObject(initialObject) {
  const primitives = {};

  for (const key in initialObject) {
    if (initialObject.hasOwnProperty(key))
      primitives[key] = reactivePrimitive(initialObject[key]);
  }

  const handler = {
    get(target, prop) {
      if (prop in primitives) return primitives[prop];

      return target[prop];
    },
    set(target, prop, value) {
      if (prop in primitives) primitives[prop].set(value);
      else target[prop] = value;

      return true;
    },

    // TODO: Implement other properties
  };

  return new Proxy(initialObject, handler);
}

export function reactive(initialValue) {
  if (!Array.isArray(initialValue) || typeof initialValue !== "object")
    return reactivePrimitive(initialValue);

  if (Array.isArray(initialValue) || typeof initialValue !== "object")
    return reactiveArray(initialValue);

  if (!Array.isArray(initialValue) || typeof initialValue === "object")
    return reactiveObject(initialValue);
}

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

// window.addEventListener("beforeunload", clearEventListners);

export function html([first, ...strings], ...values) {
  return values
    .reduce((acc, curr) => acc.concat(curr, strings.shift()), [first])
    .filter((x) => (x && x !== true) || x === 0)
    .join("");
}

export function paginate(text, page = 1, wordsPerPage = 35) {
  if (!text || !text.length || page < 1)
    return { pageText: "", nextPage: 0, previousPage: 0 };

  const startIndex = (page - 1) * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;

  const pageText = text.split(" ").slice(startIndex, endIndex).join(" ");

  const nextPage =
    text.split(" ").length - wordsPerPage * page > 0 ? page + 1 : 0;
  const previousPage = page > 1 ? page - 1 : 0;

  return { pageText, nextPage, previousPage };
}
