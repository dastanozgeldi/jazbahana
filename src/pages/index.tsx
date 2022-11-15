import { Page } from "layouts/Page";
import { About } from "components/landing/About";
import { Features } from "components/landing/Features";
import { Hero } from "components/landing/Hero";
import { Authors } from "components/landing/Authors";

const Home = () => {
  return (
    <Page title="Home">
      <Hero />
      <About />
      <Features />
      <Authors />
    </Page>
  );
};

export default Home;
