import Link from "next/link";
import { CARD, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

const Topics = () => {
  const { data } = trpc.useQuery(["topic.all"]);
  return (
    <div className="max-w-[60ch] mx-auto">
      <h1 className={NOTIFICATION}>
        Here is the list of all topics Jazbahana currently has. They categorize
        the subject of a room, making it easy for you to find what you need!
      </h1>
      <div className={CARD}>
        {data?.map((t) => (
          <Link href={`/feed/?topicId=${t.id}`}>
            <a className="w-full rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 hover:duration-300">
              <div className="flex items-center gap-2 p-2 m-2">
                {t.image && (
                  <img src={t.image} alt="Topic" className="w-6 h-6" />
                )}
                {t.name}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Topics;
