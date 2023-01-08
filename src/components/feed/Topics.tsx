import Image from "next/image";
import Link from "next/link";
import { AiOutlineDown } from "react-icons/ai";
import { trpc } from "utils/trpc";

export const Topics = () => {
  const { data } = trpc.topic.getSome.useQuery({ limit: 5 });

  return (
    <div className="hidden md:block w-[70%]">
      <h1 className="text-2xl font-semibold text-center">Browse Topics</h1>
      <ul>
        <Link
          href="/feed"
          className="flex items-center justify-between my-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300"
        >
          <span className="text-xl p-2">All</span>
        </Link>
        {data?.map((t) => (
          <li
            key={t.id}
            className="my-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300"
          >
            <Link
              href={`/feed/?topicId=${t.id}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                {t.image && (
                  <Image
                    alt="topic image"
                    src={t.image}
                    width={24}
                    height={24}
                  />
                )}
                <span className="text-xl p-2">{t.name}</span>
              </div>
              <span className="text-xl px-2 rounded bg-gray-100 dark:bg-gray-800">
                {t.rooms.length}
              </span>
            </Link>
          </li>
        ))}
        <Link
          href="/topics"
          className="w-max flex items-center gap-2 text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-500 px-4 py-2 rounded-lg"
        >
          More <AiOutlineDown size={16} />
        </Link>
      </ul>
    </div>
  );
};
