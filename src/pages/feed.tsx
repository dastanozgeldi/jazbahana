import { useSession } from "next-auth/react";
import RoomsSection from "../components/RoomsSection";
import Topics from "../components/Topics";
import Page from "../components/layouts/Page";
import News from "components/News";

const Feed = () => {
  const { data: session } = useSession();
  return (
    <Page className="m-2" title="Feed">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome, {session?.user?.name || "Guest"}!
        </h1>
        <p>
          smooth user experience made possible by{" "}
          <a
            className="text-teal-400"
            href="https://twitter.com/dastanozgeldi"
            target="blank"
            rel="noreferrer"
          >
            @dastanozgeldi
          </a>
        </p>
      </div>
      <div className="my-8 block md:grid md:grid-cols-3 md:justify-items-center">
        {/* Left Sidebar */}
        <Topics />
        {/* Rooms Section */}
        <RoomsSection session={session} />
        {/* Right Sidebar */}
        <News />
      </div>
    </Page>
  );
};

export default Feed;
