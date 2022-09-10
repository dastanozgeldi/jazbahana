import {
    IoLogoGithub,
    IoLogoTwitter,
    IoLogoInstagram,
    IoLogoDiscord,
  } from "react-icons/io5";

const SocialLinks = ({size}: {size: React.ReactNode}) => {
  return (
    <div className={flex items-center justify-around ${size}}>
      <a
        className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
        href="https://discord.gg/jgE2m4cnFj"
        target="_blank"
        rel="noreferrer"
      >
        <IoLogoDiscord />
      </a>
      <a
        className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
        href="https://github.com/jolshylar"
        target="_blank"
        rel="noreferrer"
      >
        <IoLogoGithub />
      </a>
      <a
        className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
        href="https://instagram.com/jolshylar"
        target="_blank"
        rel="noreferrer"
      >
        <IoLogoInstagram />
      </a>
      <a
        className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
        href="https://twitter.com/jolshylar"
        target="_blank"
        rel="noreferrer"
      >
        <IoLogoTwitter />
      </a>
    </div>
  );
};
