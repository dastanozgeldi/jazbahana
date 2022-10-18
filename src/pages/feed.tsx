import { useSession } from "next-auth/react";
import RoomsSection from "../components/rooms/RoomsSection";
import Topics from "../components/Topics";
import Page from "../components/layouts/Page";
import News from "components/News";
import Link from "next/link";
import Search from "components/Search";

const Feed = () => {
  const { data: session } = useSession();

  return (
    <Page className="m-2" title="Feed">
      {/* Header */}
      <Search />
      <div className="md:hidden flex items-center justify-center gap-2 my-4">
        <Link href="/topics">
          <a className="text-sm rounded-full border border-blue-500 py-2 px-4 text-blue-500 hover:text-gray-100 hover:bg-blue-500 hover:duration-500">
            Browse Topics
          </a>
        </Link>
        <Link href="/news">
          <a className="text-sm rounded-full border border-blue-500 py-2 px-4 text-blue-500 hover:text-gray-100 hover:bg-blue-500 hover:duration-500">
            Read News
          </a>
        </Link>
      </div>
      {/* Main Feed */}
      <div className="my-8 block md:grid md:grid-cols-3 md:justify-items-center">
        <Topics />
        <RoomsSection session={session} />
        <News />
      </div>
    </Page>
  );
};

export default Feed;
