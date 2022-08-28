import type { NextPage } from "next";
import Page from "./layouts/Page";
import About from "../components/About";
import Features from "../components/Features";
import Contacts from "../components/Contacts";
import Card from "../components/Card";

const Home: NextPage = () => {
  return (
    <Page title="Home">
      <div className="flex flex-col md:flex-row gap-6 justify-between m-20">
        <div>
          <h1 className="text-5xl font-extrabold text-blue-500">Jazbahana</h1>
          <p>the way students connect</p>
        </div>

        <div>
          <Card className="-ml-20" href="#about" title="About Jazbahana">
            what is Jazbahana, its importance and purposes to serve such an
            important audience.
          </Card>

          <Card className="ml-20" href="#features" title="Features">
            what Jazbahana offers, the benefits of using it and many more.
          </Card>

          <Card className="-ml-20" href="#contacts" title="Contacts">
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
