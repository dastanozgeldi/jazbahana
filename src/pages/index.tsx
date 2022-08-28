import type { NextPage } from "next";
import { CARD } from "../styles";
import Page from "./layouts/Page";
import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";
import About from "../components/About";
import Features from "../components/Features";
import Contacts from "../components/Contacts";

type CardProps = { title: string; children: React.ReactNode; href: string };

const Card = ({ children, title, href }: CardProps) => {
  return (
    <div className={`${CARD} w-[300px] h-[200px]`}>
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

const Home: NextPage = () => {
  return (
    <Page title="Home">
      <div className="flex flex-col md:flex-row gap-6 justify-between m-20">
        <div>
          <h1 className="text-5xl font-extrabold text-blue-500">Jazbahana</h1>
          <p>the way students connect</p>
        </div>

        <div>
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

      <About />

      <Features />

      <Contacts />
    </Page>
  );
};

export default Home;
