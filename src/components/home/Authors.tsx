import Avatar from "components/Avatar";
import { CARD, HIGHLIGHT } from "styles";

export const Authors = () => {
  return (
    <div
      id="authors"
      className="min-h-screen flex items-center justify-center py-10"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-500 mb-4">
          Authors
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-4">
          <div className="max-w-[48ch]">
            <p className="text-xl">
              Jazbahana initially started as an idea where you can{" "}
              <span className={HIGHLIGHT}>host a temporary room</span>, send the{" "}
              <span className={HIGHLIGHT}>invite link</span> to a person and
              make <span className={HIGHLIGHT}>trade with your notes.</span>
            </p>
            <p className="text-xl my-2">
              It eventually grew up to something you see today - a full-fledged
              platform with chats, workspaces and notes support.
            </p>
            <p className="text-xl">
              But the main point of that all is that Jazbahana is focused on
              individual, offline studying
            </p>
          </div>
          <div className={`${CARD} max-w-max mx-auto md:max-w-none`}>
            <Avatar
              src="https://github.com/Dositan/dosek.xyz/blob/main/src/assets/profile.jpg?raw=true"
              size={100}
            />
            <h2 className="text-2xl">Dastan Özgeldi</h2>
            <span className="text-blue-500 text-xl">Creator of Jazbahana</span>
            <a className="text-lg" href="https://dosek.xyz/">
              https://dosek.xyz/
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
