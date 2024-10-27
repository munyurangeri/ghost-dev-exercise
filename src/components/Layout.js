import { html } from "../lib";

const Layout = ({ page }) => {
  return html`
    <div
      class="w-full h-screen p-0 m-0 text-white bg-gradient-to-r from-[#F15C22] from-0% via-[#F7931D] via-50% to-[#FFC840] to-100%"
    >
      ${page}
    </div>
  `;
};

export default Layout;
