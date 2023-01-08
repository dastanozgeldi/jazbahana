import Image from "next/image";
import Link from "next/link";
import { CARD, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

const Topics = () => {
  const { data } = trpc.topic.all.useQuery();

  return (
    <div className="max-w-[60ch] mx-auto">
      <h1 className={NOTIFICATION}>
        Here is the list of all topics Jazbahana currently has. They categorize
        the subject of a room, making it easy for you to find what you need!
      </h1>
      <div className={CARD}>
        {data?.map((t) => (
          <Link
            href={`/feed/?topicId=${t.id}`}
            className="flex items-center justify-between px-2 w-full rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 hover:duration-300"
          >
            <div className="flex items-center gap-2 p-2 m-2">
              {t.image && (
                <Image src={t.image} alt="Topic" width={24} height={24} />
              )}
              {t.name}
            </div>
            <span className="text-xl px-2 rounded bg-gray-100 dark:bg-gray-800">
              {t.rooms.length}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Topics;
