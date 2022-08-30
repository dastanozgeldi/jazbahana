import { useSession } from "next-auth/react";
import RecentActivity from "../components/RecentActivity";
import RoomsSection from "../components/RoomsSection";
import Topics from "../components/Topics";
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
        {/* Left Sidebar */}
        <Topics />
        {/* Rooms Section */}
        <RoomsSection roomsQuery={roomsQuery} session={session} />
        {/* Right Sidebar */}
        <RecentActivity />
      </div>
    </Page>
  );
};

export default Feed;
