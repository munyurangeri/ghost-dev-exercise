import "./style.css";
import { html } from "./lib";

import Layout from "./components/Layout";
import StoryPage from "./StoryPage";

async function renderPage() {
  document.querySelector("#app").innerHTML = html`${Layout({
    page: await StoryPage(),
  })}`;
}

renderPage();
