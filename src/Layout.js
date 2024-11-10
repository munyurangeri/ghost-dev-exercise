import { html } from "./lib";

const Layout = ({ page }) => {
  const markups = `
    <div  class="min-h-screen w-full flex flex-col justify-center text-white bg-[#F15C22] lg:bg-gradient-to-r lg:from-[#F15C22] lg:from-0% lg:via-[#F7931D] lg:via-70% lg:to-[#FFC840] lg:to-100%" >
      ${page}
    </div>`;

  return html`${markups}`;
};

export default Layout;
