import { FEATURE, HIGHLIGHT } from "../../styles";

export const Features = () => {
  return (
    <div
      id="features"
      className="min-h-screen flex justify-center items-center py-10"
    >
      <div>
        <h1 className="text-blue-500 text-4xl md:text-5xl font-extrabold text-center">
          Features
        </h1>
        <div className="flex flex-col items-center justify-between mt-20 gap-y-5">
          <div className="flex flex-col md:flex-row items-center">
            <img src="/workspace.svg" className="md:w-[50%]" />
            <p className={`${FEATURE} md:-ml-10`}>
              <span className={HIGHLIGHT}>1. Workspaces.</span> Each user has a
              workspace where they can browse their current homework, deadlines,
              recent notes and connections!
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center mt-5">
            <p className={`${FEATURE} md:-mr-10`}>
              <span className={HIGHLIGHT}>2. Rooms.</span> They separate one
              discussion from another and keep the environment clean and
              concise, with chat and space for uploading files are included.
            </p>
            <img src="/rooms.svg" className="md:w-[50%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
