import type { NextPage } from "next";
import Page from "../components/layouts/Page";
import About from "../components/home/About";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";

const Home: NextPage = () => {
  return (
    <Page title="Home">
      <Hero />
      <About />
      <Features />
    </Page>
  );
};

export default Home;
