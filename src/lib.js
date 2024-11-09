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

export function granularReactive(initialObject) {
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
  if (Array.isArray(initialValue)) return reactiveArray(initialValue);
  return reactivePrimitive(initialValue);
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

export function formatNumber(num) {
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(1) + "B";
  else if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1) + "M";
  else if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(1) + "K";
  else return num.toString();
}

// TODO: Refactor by making use of the bellow functions

export function promise(promise, errorsToCatch) {
  return promise
    .then((response) => response.json())
    .then((data) => [undefined, data])
    .catch((error) => {
      if (!errorsToCatch || errorsToCatch.length === 0) return [error];

      if (errorsToCatch.some((e) => error instanceof e)) return [error];

      throw error;
    });
}

export function fetch(url, method = "GET", body = {}) {
  // TODO: Handle all methods, setting headers as neccessary
  // TODO: How about caching? how `swr` lib works? Can I make something like it?

  return [undefined, data];
}

export function onMount() {
  // TODO: abstruct away the use of `setInterval` when subscribing to data change that has to update UI (Html element)
}

// TODO: Implement FEATURE FLAGS

// TOOD: Learn how server-actions (in frameworks) are implemented
// TODO: Make a router that works both CSR and SSR and refactor the code so it can work on server(ssr)
