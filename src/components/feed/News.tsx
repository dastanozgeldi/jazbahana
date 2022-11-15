import Link from "next/link";
import { AiOutlineArrowRight, AiOutlineDown } from "react-icons/ai";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

export const News = () => {
  const { data } = trpc.news.getSome.useQuery({ limit: 3 });
  const addView = trpc.news.addView.useMutation();

  return (
    <div className="hidden md:block w-[80%]">
      <h1 className="text-2xl font-semibold text-center">Read News</h1>
      {data &&
        data.map((item) => (
          <div key={item.id} className={`${CARD} my-4`}>
            <div className="w-full">
              <h2 className="text-xl">{item.title}</h2>
              <p className="text-gray-400">{item.description}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="font-semibold">{item.views} views</p>
              <Link
                href={`/news/${item.id}`}
                onClick={async () => await addView.mutateAsync({ id: item.id })}
                className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
              >
                <AiOutlineArrowRight />
              </Link>
            </div>
          </div>
        ))}
      <Link
        href="/news"
        className="w-max flex items-center gap-2 text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-500 px-4 py-2 rounded-lg"
      >
        More <AiOutlineDown size={16} />
      </Link>
    </div>
  );
};
