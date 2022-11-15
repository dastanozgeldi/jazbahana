import Link from "next/link";
import Typewriter from "typewriter-effect";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CARD } from "styles";

type HeroCardProps = {
  title: string;
  children: React.ReactNode;
  href: string;
};

const HeroCard = ({ children, title, href }: HeroCardProps) => {
  return (
    <div
      className={`${CARD} relative w-[320px] h-[180px] text-center shadow shadow-red-500`}
    >
      <h1 className="text-yellow-500 text-2xl font-semibold">{title}</h1>
      <p>{children}</p>
      <Link
        href={href}
        className="absolute bottom-5 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
      >
        <AiOutlineArrowRight className="w-7 h-7" />
      </Link>
    </div>
  );
};

export const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="my-8">
        <h1 className="font-extrabold text-center text-4xl md:text-5xl text-blue-500">
          Jazbahana
        </h1>
        <div className="md:flex md:gap-2 font-extrabold text-center text-3xl md:text-4xl">
          the way students{" "}
          <span className="text-blue-500">
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                strings: ["connect", "share", "study efficiently"],
              }}
            />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <HeroCard href="#about" title="About Jazbahana">
          what is Jazbahana, its importance and purposes.
        </HeroCard>
        <HeroCard href="#features" title="Features">
          what Jazbahana offers, the benefits of using it and many more.
        </HeroCard>
        <HeroCard href="#authors" title="Authors">
          info about the authors of the project, ways to connect.
        </HeroCard>
      </div>
    </div>
  );
};
