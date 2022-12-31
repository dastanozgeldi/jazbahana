import { CARD } from "styles";
import { Avatar } from "components/common/Avatar";

export const Authors = () => (
  <div id="authors">
    <div className="md:w-[80%] md:mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-500 mb-4">
        Authors
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-around my-6">
        <div className="max-w-[48ch] mx-auto md:mx-0">
          <p className="text-xl">
            Jazbahana initially started as an idea where you can{" "}
            <b>host a temporary room</b>, send the <b>invite link</b> to a
            person and make <b>trade with your notes.</b>
          </p>
          <p className="text-xl">
            It eventually grew up to something you see today - a full-fledged
            platform with <b>chats, workspaces and notes</b> support.
          </p>
          <p className="text-xl">
            But the main point of that all is that Jazbahana is focused on{" "}
            <b>individual, offline studying</b>.
          </p>
        </div>
        <div className={`${CARD} w-[260px] mx-auto md:mx-0 p-4 my-4`}>
          <Avatar
            src="https://github.com/Dositan/dosek.xyz/blob/main/src/assets/profile.jpg?raw=true"
            size={150}
          />
          <h1 className="text-3xl font-bold mt-4">Dastan Özgeldi</h1>
          <span className="text-blue-500 text-xl">Developer</span>
          <a className="text-lg" href="https://dosek.xyz/">
            https://dosek.xyz/
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-around my-6">
        <div className={`${CARD} w-[260px] mx-auto md:mx-0 p-4 my-4`}>
          <Avatar
            src="https://www.sbek22.xyz/images/profileBek.jpeg"
            size={150}
          />
          <h1 className="text-3xl font-bold mt-4">Bek Slambek</h1>
          <span className="text-blue-500 text-xl">Developer</span>
          <a className="text-lg" href="https://sbek22.xyz/">
            https://sbek22.xyz/
          </a>
        </div>
        <div className="max-w-[48ch] mx-auto md:text-right md:mx-0">
          <p className="text-xl">
            These are the <b>creators</b> of Jazbahana. A lot of{" "}
            <b>design, decisions, brainstorming, reviewing, research</b> and
            finally <b>coding</b> was put into this product.
          </p>
          <p className="text-xl">
            However, implementing the product <b>wasn't</b> the biggest{" "}
            <b>challenge</b> we've had so far. The worst problem we had was
            deploying the <b>app to production</b> - setting up the config
            files, environment variables and bundling the whole app.
          </p>
        </div>
      </div>
    </div>
  </div>
);
