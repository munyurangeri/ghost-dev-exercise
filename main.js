import "./src/style.css";
import { html } from "./src/lib";

import Layout from "./src/components/Layout";
import StoriesPage from "./src/StoriesPage";
import StoryPage from "./src/StoryPage";

document.querySelector("#app").innerHTML = html`${Layout({
  page: StoryPage(),
})}`;
