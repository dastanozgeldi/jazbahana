import { useSession } from "next-auth/react";
import Link from "next/link";
import RoomsSection from "../components/RoomsSection";
import { trpc } from "../utils/trpc";
import Page from "./layouts/Page";

const Feed = () => {
  const { data: session } = useSession();
  const roomsQuery = trpc.useQuery(["room.all"]);

  return (
    <Page className="m-2" title="Feed">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome, {session?.user?.name || "Guest"}!
        </h1>
        <p>
          smooth user experience made possible by{" "}
          <a className="text-teal-400" href="https://twitter.com/dastanozgeldi">
            @dastanozgeldi
          </a>
        </p>
      </div>
      <div className="my-8 block md:grid md:grid-cols-3 md:justify-items-center">
        {/* Display Topics */}
        <Topics />
        {/* Display Rooms */}
        <RoomsSection roomsQuery={roomsQuery} session={session} />
        <Activity />
      </div>
    </Page>
  );
};

const Topics = () => {
  const topicsQuery = trpc.useQuery(["topic.all"]);

  return (
    <div className="hidden md:block">
      <h1 className="text-2xl font-semibold">Browse Topics</h1>
      <ul>
        {topicsQuery.data?.map((t) => (
          <li
            key={t.topicId}
            className="my-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300"
          >
            <Link href={`/feed/?q=${t.name}`}>
              <a className="flex items-center">
                {t.image && (
                  <img src={t.image} alt="topic image" width={24} height={24} />
                )}
                <span className="text-xl p-2">{t.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Activity = () => {
  return (
    <div className="hidden md:block">
      <h1 className="text-2xl font-semibold">Recent Activity</h1>
      <p>yet to do</p>
    </div>
  );
};

export default Feed;
