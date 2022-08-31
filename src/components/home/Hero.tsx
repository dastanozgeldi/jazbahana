import Card from "../Card";
import {
  IoLogoGithub,
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoDiscord,
} from "react-icons/io5";

const Hero = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-center items-center">
      <div className="md:text-6xl text-4xl font-extrabold text-center">
        <h1 className=" text-blue-500">Jazbahana</h1>
        <p>the way students connect</p>
        <div className="flex items-center justify-around text-3xl md:text-4xl mt-16">
          <a href="https://discord.gg/jgE2m4cnFj" target="_blank">
            <IoLogoDiscord />
          </a>
          <a href="https://github.com/jolshylar" target="_blank">
            <IoLogoGithub />
          </a>
          <a href="https:///instagram.com/jolshylar" target="_blank">
            <IoLogoInstagram />
          </a>
          <a href="https://twitter.com/jolshylar" target="_blank">
            <IoLogoTwitter />
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center lg:flex-row justify-between w-[90%] mt-16 gap-y-5">
        <Card className="" href="#about" title="About Jazbahana">
          what is Jazbahana, its importance and purposes to serve such an
          important audience.
        </Card>

        <Card className="" href="#features" title="Features">
          what Jazbahana offers, the benefits of using it and many more.
        </Card>

        <Card className="" href="#contacts" title="Contacts">
          ways to connect w/ authors, leave feedback or write to support team.
        </Card>
      </div>
    </div>
  );
};

export default Hero;
