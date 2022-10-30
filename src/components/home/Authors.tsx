import Avatar from "components/Avatar";
import { CARD } from "styles";

type TextElementProps = { children: React.ReactNode };

const Paragraph = ({ children }: TextElementProps) => (
  <p className="text-xl my-2">{children}</p>
);

const H = ({ children }: TextElementProps) => (
  <span className="text-yellow-500 font-bold">{children}</span>
);

export const Authors = () => (
  <div id="authors">
    <div className="md:w-[80%] md:mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-500 mb-4">
        Authors
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-around my-6">
        <div className="max-w-[48ch]">
          <Paragraph>
            Jazbahana initially started as an idea where you can{" "}
            <H>host a temporary room</H>, send the <H>invite link</H> to a
            person and make <H>trade with your notes.</H>
          </Paragraph>
          <Paragraph>
            It eventually grew up to something you see today - a full-fledged
            platform with <H>chats, workspaces and notes</H> support.
          </Paragraph>
          <Paragraph>
            But the main point of that all is that Jazbahana is focused on{" "}
            <H>individual, offline studying</H>.
          </Paragraph>
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
          <a className="text-lg" href="https://dosek.xyz/">
            https://sbek22.xyz/
          </a>
        </div>
        <div className="max-w-[48ch] md:text-right">
          <Paragraph>
            These are the <H>creators</H> of Jazbahana. A lot of{" "}
            <H>design, decisions, brainstorming, reviewing, research</H> and
            finally <H>coding</H> was put into this product.
          </Paragraph>
          <Paragraph>
            However, implementing the product <H>wasn't</H> the biggest{" "}
            <H>challenge</H> we've had so far. The worst problem we had was
            deploying the <H>app to production</H> - setting up the config
            files, environment variables, implementing websockets and bundling
            the whole app.
          </Paragraph>
        </div>
      </div>
    </div>
  </div>
);
