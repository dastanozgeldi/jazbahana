import H from "../Highlight";

const About = () => {
  return (
    <div
      id="about"
      className="min-h-screen flex-col items-center justify-center mt-10"
    >
      <div className="md:text-6xl text-4xl font-extrabold text-center">
        <span>About</span> <span className="text-blue-500">Jazbahana</span>
      </div>
      <div className="flex flex-col gap-y-8 items-center justify-around my-24 mx-0 md:mx-24">
        <p className="sm:text-3xl text-lg font-normal">
          it is a one-to-one note-trader platform where <H>you</H> and your{" "}
          <H>friends</H> can share different{" "}
          <H>notes, lectures and presentations</H> by joining an isolated
          environment that we call <H>rooms.</H>
        </p>
        <img src="/team.png"/>
      </div>
    </div>
  );
};

export default About;
