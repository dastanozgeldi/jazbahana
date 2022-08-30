import Link from "next/link";
import { trpc } from "../utils/trpc";

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

export default Topics;
