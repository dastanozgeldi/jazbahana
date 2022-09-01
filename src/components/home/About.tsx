import H from "../Highlight";

const About = () => {
  return (
    <div
      id="about"
      className="min-h-screen flex items-center justify-center py-10"
    >
      <div>
        <div className="text-4xl md:text-5xl font-extrabold text-center">
          About <span className="text-blue-500">Jazbahana</span>
        </div>
        <div className="flex flex-col gap-y-8 items-center justify-around my-24 mx-0 md:mx-24">
          <p className="sm:text-3xl text-lg font-normal">
            it is a one-to-one note-trader platform where <H>you</H> and your{" "}
            <H>friends</H> can share different{" "}
            <H>notes, lectures and presentations</H> by joining an isolated
            environment that we call <H>rooms.</H>
          </p>
          <img src="/team.png" />
        </div>
      </div>
    </div>
  );
};

export default About;
