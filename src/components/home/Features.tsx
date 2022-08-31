import H from "../Highlight";
import { FEATURE } from "../../styles";

const Features = () => {
  return (
    <div
      id="features"
      className="min-h-screen flex flex-col justify-center items-center"
    >
      <h1 className="text-blue-500 text-4xl md:text-5xl font-extrabold text-center">
        Features
      </h1>
      <div className="flex flex-col items-center justify-between w-[90%] mt-20 gap-y-5">
        <div className="flex flex-col md:flex-row items-center">
          <img src="/economy.png" className="md:w-[50%]" />
          <p className={`${FEATURE} md:-ml-10`}>
            <H>1. Economy.</H> Each person gets 300JPC aka jazbapoint currency
            at the start. JPCs are spent on private rooms, no-trade notes and
            donations.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center mt-5">
          <p className={`${FEATURE} md:-mr-10`}>
            <H>2. Rooms.</H> Can be either public or private. Rooms separate one
            topic from the other and keep the environment clean and concise
          </p>
          <img src="/rooms.png" className="md:w-[50%]" />
        </div>
      </div>
    </div>
  );
};

export default Features;
