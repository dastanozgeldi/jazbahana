import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import RoomsSection from "../components/RoomsSection";
import { trpc } from "../utils/trpc";
import Page from "./layouts/Page";

export const Navbar = () => {
  return (
    <nav>
      <Link href="/">
        <a className="flex items-center">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
          <span className="text-3xl font-bold">Jazbahana</span>
        </a>
      </Link>
    </nav>
  );
};

const Feed = () => {
  const { data: session } = useSession();
  const roomsQuery = trpc.useQuery(["room.all"]);

  return (
    <Page className="m-2" title="Feed">
      <Navbar />
      {/* Header */}

      <div className="block md:grid md:grid-cols-3 md:justify-items-center">
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
                  // eslint-disable-next-line
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
    </div>
  );
};

export default Feed;
