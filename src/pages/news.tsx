import Link from "next/link";
import { trpc } from "utils/trpc";

const News = () => {
  const { data } = trpc.useQuery(["news.all"]);
  return (
    <div className="max-w-[48ch] mx-auto">
      {/* TODO: put some filters like by popularity, date or something */}
      {data?.map((item) => (
        <Link href={`/news/${item.id}`}>
          <a>
            <div className="p-4 m-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-500 rounded-xl">
              <h2 className="text-xl">{item.title}</h2>
              <p className="text-gray-400">{item.description}</p>
              <span className="font-semibold">{item.views} views</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default News;
