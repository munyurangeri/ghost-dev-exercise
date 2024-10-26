import { html } from "../lib";

const Layout = ({ component }) => {
  return html`
    <div
      class="w-full h-screen 
        flex justify-center items-center 
        bg-gradient-to-r from-[#F15C22] from-0% 
                         via-[#F7931D] via-50% 
                         to-[#FFC840] to-100%"
    >
      ${component}
    </div>
  `;
};

export default Layout;
