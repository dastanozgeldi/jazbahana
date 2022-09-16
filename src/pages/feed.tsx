import { useSession } from "next-auth/react";
import RoomsSection from "../components/RoomsSection";
import Topics from "../components/Topics";
import Page from "../components/layouts/Page";
import News from "components/News";
import Link from "next/link";

const Feed = () => {
  const { data: session } = useSession();
  return (
    <Page className="m-2" title="Feed">
      {/* Header */}
      <div>
        {/* Search Bar */}
        <form>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block p-4 pl-10 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Search Rooms, Users..."
              required
            />
            <button
              type="submit"
              className="absolute right-2.5 bottom-2.5 text-gray-100 bg-teal-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </button>
          </div>
        </form>
        <div className="sm:hidden flex items-center justify-center gap-2 my-4">
          <Link href="/topics">
            <a>
              <button className="text-sm rounded-full border border-teal-400 py-2 px-4 text-teal-400 hover:text-gray-100 hover:bg-teal-400 hover:duration-500">
                Browse Topics
              </button>
            </a>
          </Link>
          <Link href="/notes">
            <a>
              <button className="text-sm rounded-full border border-teal-400 py-2 px-4 text-teal-400 hover:text-gray-100 hover:bg-teal-400 hover:duration-500">
                Recent Notes
              </button>
            </a>
          </Link>
        </div>
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
