import { H } from "components/common/Text";

const FEATURE =
  "bg-white dark:bg-neutral-800 py-6 px-4 opacity-80 rounded-md shadow-2xl";

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
            <img src="/landing/workspace.svg" className="md:w-[50%]" />
            <p className={`${FEATURE} md:-ml-10`}>
              <H>1. Workspaces.</H> Each user has a workspace where they can
              browse their current homework, deadlines, recent notes and
              connections!
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center mt-5">
            <p className={`${FEATURE} md:-mr-10`}>
              <H>2. Rooms.</H> They separate one discussion from another and
              keep the environment clean and concise, with chat and space for
              uploading files are included.
            </p>
            <img src="/landing/rooms.svg" className="md:w-[50%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
