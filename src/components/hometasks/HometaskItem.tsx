import type { Topic, Hometask, User } from "@prisma/client";
import Link from "next/link";
import { CARD } from "styles";

type HometaskItemProps = {
  hometask: Hometask & { user: User; topic: Topic };
};

export const HometaskItem = ({ hometask }: HometaskItemProps) => (
  <div className={`${CARD} my-4`}>
    <div className="w-full">
      <Link
        href={`/workspace/hometasks/${hometask.id}`}
        className={`text-xl ${hometask.finished && "line-through"}`}
      >
        {hometask.title}
      </Link>
      <p className="text-gray-400">{hometask.content?.slice(0, 50)}</p>
    </div>
    <div className="w-full flex items-center justify-between">
      <p className="font-semibold">{hometask.topic.name}</p>
      <p className="font-semibold">{hometask.due?.toLocaleDateString()}</p>
    </div>
  </div>
);
