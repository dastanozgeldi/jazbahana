import Link from "next/link";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

const Topics = () => {
  const { data } = trpc.useQuery(["topic.all"]);
  return (
    <div className={CARD}>
      {data?.map((t) => (
        <Link href={`/feed/?topicId=${t.id}`}>
          <a className="w-full rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 hover:duration-300">
            <div className="flex items-center gap-2 p-2 m-2">
              {t.image && <img src={t.image} alt="Topic" className="w-6 h-6" />}
              {t.name}
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Topics;
