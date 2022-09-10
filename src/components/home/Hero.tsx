import Card from "../Card";
import SocialLinks from "components/SocialLinks";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div>
        <h1 className="font-extrabold text-center text-4xl md:text-5xl text-blue-500">
          Jazbahana
        </h1>
        <p className="font-extrabold text-center text-3xl md:text-4xl">
          the way students connect
        </p>
        <SocialLinks size="text-3xl md:text-4xl mt-8"/>


      <div className="flex flex-col items-center xl:flex-row justify-between w-[90%] mt-8 gap-y-5">
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
