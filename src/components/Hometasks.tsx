import Link from "next/link";
import { AiOutlineDown } from "react-icons/ai";
import { ACTION_BUTTON, CARD, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

export const HometaskSection = () => {
  const { data } = trpc.useQuery(["hometask.all"]);

  return (
    <div className="lg:mx-4">
      <h1 className={`${NOTIFICATION} text-center`}>
        Hometasks page. Here are your most recent things to do.
      </h1>
      <Link href="/new/hometask">
        <button className={`${ACTION_BUTTON} w-full`}>Add Hometasks</button>
      </Link>
      {data &&
        data.map((item) => (
          <div key={item.id} className={`${CARD} my-4 max-w-[48ch]`}>
            <div className="w-full">
              <Link href={`/workspace/hometasks/${item.id}`}>
                <a className="text-xl">{item.title}</a>
              </Link>
              <p className="text-gray-400">{item.content?.slice(0, 50)}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="font-semibold">{item.topic.name}</p>
              <p>{item.due?.toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      <Link href="/workspace/hometasks">
        <a className="w-max flex items-center gap-2 text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-500 px-4 py-2 rounded-lg">
          More <AiOutlineDown size={16} />
        </a>
      </Link>
    </div>
  );
};
