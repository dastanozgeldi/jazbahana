import { Page } from "layouts/Page";
import { About } from "components/landing/About";
import { Features } from "components/landing/Features";
import { Hero } from "components/landing/Hero";

const Home = () => {
  return (
    <Page title="Home">
      <Hero />
      <About />
      <Features />
    </Page>
  );
};

export default Home;
