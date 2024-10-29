import { html } from "../lib";

const Layout = ({ page }) => {
  return html`
    <div
      class="w-full h-screen p-0 m-0 text-white bg-[#F15C22] lg:bg-gradient-to-r lg:from-[#F15C22] lg:from-0% lg:via-[#F7931D] lg:via-50% lg:to-[#FFC840] lg:to-100%"
    >
      ${page}
    </div>
  `;
};

export default Layout;
