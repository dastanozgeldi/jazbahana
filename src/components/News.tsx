import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

const News = () => {
  const { data } = trpc.useQuery(["news.all"]);
  const addView = trpc.useMutation("news.addView");

  return (
    <div className="hidden md:block">
      <h1 className="text-2xl font-semibold text-center">News</h1>
      {data &&
        data.map((item) => (
          <div
            key={item.id}
            className="my-4 flex flex-col text-[#202020] bg-neutral-100 dark:text-neutral-100 dark:bg-[#202020] p-4 rounded-xl"
          >
            <div>
              <h2 className="text-xl">{item.title}</h2>
              <p className="text-gray-400">{item.description}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="font-semibold">{item.views} views</p>
              <Link href={`/news/${item.id}`}>
                <a
                  onClick={async () =>
                    await addView.mutateAsync({ id: item.id })
                  }
                  className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
                >
                  <AiOutlineArrowRight />
                </a>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default News;
