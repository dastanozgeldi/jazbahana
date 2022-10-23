import { CARD } from "styles";

export const UpcomingDeadlines = () => {
  return (
    <div className="xl:mx-4 my-4">
      <h1 className="text-center text-2xl font-semibold my-2">
        Upcoming Deadlines
      </h1>

      <div className={`${CARD} my-2`}>
        <div>
          <h1 className="text-xl font-bold">Ulpalar asf</h1>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequatur illum, minus fugiat necessitatibus ducimus distinctio
            quia.
          </p>
          <span className="font-bold text-red-500">Biology</span>
        </div>
      </div>
      <div className={`${CARD} my-2`}>
        <div>
          <h1 className="text-xl font-bold">Stereometry</h1>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequatur illum, minus fugiat necessitatibus ducimus distinctio
            quia.
          </p>
          <span className="font-bold text-green-500">Math</span>
        </div>
      </div>
      <div className={`${CARD} my-2`}>
        <div>
          <h1 className="text-xl font-bold">
            Ammonia - production, economy and usage.
          </h1>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequatur illum, minus fugiat necessitatibus ducimus distinctio
            quia.
          </p>
          <span className="font-bold text-red-500">Chemistry</span>
        </div>
      </div>
    </div>
  );
};
