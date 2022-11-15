import { IoSearch } from "react-icons/io5";

export const Search = () => {
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
