import { useSession } from "next-auth/react";
import RoomsSection from "components/feed/RoomsSection";
import { Page } from "layouts/Page";
import Link from "next/link";
import { Topics } from "components/feed/Topics";
import { News } from "components/feed/News";
import { Search } from "components/feed/Search";

const Feed = () => {
  const { data: session } = useSession();

  return (
    <Page className="m-2" title="Feed">
      {/* Header */}
      <Search />
      <div className="md:hidden flex items-center justify-center gap-2 my-4">
        <Link
          href="/topics"
          className="text-sm rounded-full border border-primary py-2 px-4 text-primary hover:text-gray-100 hover:bg-primary hover:duration-500"
        >
          Browse Topics
        </Link>
        <Link
          href="/news"
          className="text-sm rounded-full border border-primary py-2 px-4 text-primary hover:text-gray-100 hover:bg-primary hover:duration-500"
        >
          Read News
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
