/* eslint-disable no-unused-vars */
import "./style.css";
import { html, reactive } from "./lib";
import Layout from "./Layout";
import StoryPage from "./StoryPage";
import { getReadStats } from "./api";
import { analyticsActions } from "./workersActions";

const analyticsWorker = new Worker("../workers/reads-statistics.js");
const imagesUrls = reactive([]);
const statisticsData = reactive({});

async function renderPage() {
  document.querySelector("#app").innerHTML = html`${Layout({
    page: await StoryPage({ analyticsWorker, imagesUrls, statisticsData }),
  })}`;
}

renderPage();

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

    navigator.serviceWorker.addEventListener("message", async (event) => {
      if (document.readyState === "complete") {
        if (event.data?.type === "update")
          console.log(`Fresh data available for: ${event.data.url}!`);

        if (event.data?.type === "analytics") {
          console.log(`Fresh ANALYTICS available!`);

          const [_, data] = await getReadStats();

          analyticsWorker.postMessage({
            action: analyticsActions.COMPUTE_ALL,
            reads: data,
          });
        }
      }
    });
  });
}
