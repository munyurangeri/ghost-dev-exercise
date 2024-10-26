import "./style.css";
import { html } from "./lib";

import Layout from "./components/Layout";
import StoriesPage from "./StoriesPage";

document.querySelector("#app").innerHTML = html`${Layout({
  page: StoriesPage(),
})}`;
