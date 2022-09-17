import { FEATURE, HIGHLIGHT } from "../../styles";

const Features = () => {
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
            <img src="/economy.png" className="md:w-[50%]" />
            <p className={`${FEATURE} md:-ml-10`}>
              <span className={HIGHLIGHT}>1. Economy.</span> Each person gets
              300JPC (also known as JazbaPoint currency) at the start. JPCs are
              spent on private rooms, no-trade notes and donations.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center mt-5">
            <p className={`${FEATURE} md:-mr-10`}>
              <span className={HIGHLIGHT}>2. Rooms.</span> Can be either public
              or private. Rooms separate one topic from the other and keep the
              environment clean and concise
            </p>
            <img src="/rooms.png" className="md:w-[50%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
