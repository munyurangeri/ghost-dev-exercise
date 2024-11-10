import "./style.css";
import { html } from "./lib";

import Layout from "./Layout";
import StoryPage from "./StoryPage";

async function renderPage() {
  document.querySelector("#app").innerHTML = html`${Layout({
    page: await StoryPage(),
  })}`;
}

renderPage();

navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data?.type === "update")
    console.log(`Fresh data available for: ${event.data.url}!`);

  if (event.data?.type === "analytics") {
    console.log(`Fresh ANALYTICS available!`);
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    // Listen for online status
    window.addEventListener("online", () => {
      registration.active.postMessage({ action: "syncOfflineData" });
    });

    // Listen for visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        // registration.active.postMessage({ action: "syncOfflineData" });
        renderPage();
      }
    });
  });
}
