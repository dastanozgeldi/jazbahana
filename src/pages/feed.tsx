import { useSession } from "next-auth/react";
import RoomsSection from "../components/feed/RoomsSection";
import Topics from "../components/feed/Topics";
import Page from "../components/layouts/Page";
import News from "components/feed/News";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <form className="max-w-[48ch] mx-auto">
      <div className="relative">
        <IoSearch className="flex absolute top-4 left-4 w-5 h-5 text-gray-400" />
        <input
          type="search"
          id="default-search"
          className="p-4 pl-12 w-full text-sm rounded-lg border border-gray-700"
          placeholder="Search Rooms, Users..."
          required
        />
        <button
          type="submit"
          className="absolute right-2.5 bottom-2.5 text-gray-100 bg-blue-500 hover:bg-blue-600 hover:duration-500 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
};

const Header = () => {
  return (
    <>
      {/* Header */}
      <Search />
      <div className="md:hidden flex items-center justify-center gap-2 my-4">
        <Link
          href="/topics"
          className="text-sm rounded-full border border-blue-500 py-2 px-4 text-blue-500 hover:text-gray-100 hover:bg-blue-500 hover:duration-500"
        >
          Browse Topics
        </Link>
        <Link
          href="/news"
          className="text-sm rounded-full border border-blue-500 py-2 px-4 text-blue-500 hover:text-gray-100 hover:bg-blue-500 hover:duration-500"
        >
          Read News
        </Link>
      </div>
    </>
  );
};

const Feed = () => {
  const { data: session } = useSession();

  return (
    <Page className="m-2" title="Feed">
      <Header />
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
