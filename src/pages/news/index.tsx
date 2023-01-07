import Link from "next/link";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

const News = () => {
  const { data } = trpc.news.all.useQuery();
  const addView = trpc.news.addView.useMutation();

  return (
    <div className="max-w-[60ch] mx-auto">
      {/* TODO: put some filters like by popularity, date or something */}
      <h1 className={`${NOTIFICATION} m-2 p-4`}>
        Try not to miss any of the news! They might be useful to boost your
        productivity.
      </h1>
      {data?.map((item) => (
        <Link
          href={`/news/${item.id}`}
          onClick={async () => await addView.mutateAsync({ id: item.id })}
        >
          <div className="p-4 m-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-500">
            <h2 className="text-xl">{item.title}</h2>
            <p className="text-gray-400">{item.description}</p>
            <span className="font-semibold">{item.views} views</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default News;
