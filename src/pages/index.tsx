import type { NextPage } from "next";
import Page from "../components/layouts/Page";
import { About } from "../components/home/About";
import { Features } from "../components/home/Features";
import { Hero } from "../components/home/Hero";
import { Authors } from "components/home/Authors";

const Home: NextPage = () => {
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
