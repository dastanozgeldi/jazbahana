import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CARD } from "styles";

type CardProps = {
  title: string;
  children: React.ReactNode;
  href: string;
  className?: string;
};

const Card = ({ children, title, href, className = "" }: CardProps) => {
  return (
    <div className={`${CARD} w-[300px] h-[200px] text-center ${className}`}>
      <h1 className="text-yellow-500 text-2xl font-semibold">{title}</h1>
      <p>{children}</p>
      <Link href={href}>
        <a>
          <AiOutlineArrowRight className="w-7 h-7" />
        </a>
      </Link>
    </div>
  );
};

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        <Card href="#about" title="About Jazbahana">
          what is Jazbahana, its importance and purposes to serve such an
          important audience.
        </Card>

        <Card href="#features" title="Features">
          what Jazbahana offers, the benefits of using it and many more.
        </Card>

        <Card href="#contacts" title="Contacts">
          ways to connect w/ authors, leave feedback or write to support team.
        </Card>
      </div>
    </div>
  );
};

export default Hero;
