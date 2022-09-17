import { HIGHLIGHT } from "styles";

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
        <div className="grid gap-6 sm:grid-cols-2 items-center my-24 md:mx-24">
          <p className="sm:text-3xl text-lg font-normal w-full">
            it&apos;s a one-to-one note-trader platform where you and your{" "}
            friends can share different{" "}
            <span className={HIGHLIGHT}>notes, lectures and presentations</span>{" "}
            by joining an isolated environment that we call{" "}
            <span className={HIGHLIGHT}>rooms</span>.
          </p>
          <img src="/team.svg" />
        </div>
      </div>
    </div>
  );
};

export default About;
