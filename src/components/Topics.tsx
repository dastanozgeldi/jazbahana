import Link from "next/link";
import { trpc } from "../utils/trpc";

const Topics = () => {
  const { data } = trpc.useQuery(["topic.all"]);

  return (
    <div className="hidden md:block w-[50%]">
      <h1 className="text-2xl font-semibold text-center">Browse Topics</h1>
      <ul>
        <Link href="/feed">
          <a className="flex items-center justify-between my-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300">
            <div className="flex items-center">
              <span className="text-xl p-2">All</span>
            </div>
          </a>
        </Link>
        {data?.map((t) => (
          <li
            key={t.id}
            className="my-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300"
          >
            <Link href={`/feed/?topicId=${t.id}`}>
              <a className="flex items-center justify-between">
                <div className="flex items-center">
                  {t.image && (
                    <img
                      src={t.image}
                      alt="topic image"
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="text-xl p-2">{t.name}</span>
                </div>
                <span className="text-xl px-2 rounded bg-gray-100 dark:bg-gray-800">
                  {t.rooms.length}
                </span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;
