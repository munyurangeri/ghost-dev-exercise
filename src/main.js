import "./style.css";
import { html } from "./lib";
import Layout from "./Layout";
import StoryPage from "./StoryPage";
import { getReadStats } from "./api";

const analyticsWorker = new Worker("../workers/reads-statistics.js");

async function renderPage() {
  document.querySelector("#app").innerHTML = html`${Layout({
    page: await StoryPage({ analyticsWorker }),
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
    window.addEventListener("online", async () => {
      const [_, data] = await getReadStats();

      analyticsWorker.postMessage({
        action: analyticsActions.COMPUTE_ALL,
        reads: data,
      });
      registration.active.postMessage({ action: "syncOfflineData" });
    });

    // Listen for visibility changes
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        const [_, data] = await getReadStats();

        analyticsWorker.postMessage({
          action: analyticsActions.COMPUTE_ALL,
          reads: data,
        });
        registration.active.postMessage({ action: "syncOfflineData" });
      }
    });
  });
}
