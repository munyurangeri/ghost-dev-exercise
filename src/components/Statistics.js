import { html } from "../lib";

const Statistics = ({ data }) => {
  data.subscribe((value) => {
    console.log({ newStaticsData: value });
  });
  
  const markups = ` <section class="w-full m-2 flex justify-center items-center text-white">Statistics</section> `;

  return html`${markups}`;
};

export default Statistics;
