import { type Hometask } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

export const HometaskItem = ({ item }: { item: Hometask & any }) => {
  const [isFinished, setIsFinished] = useState(item.finished);
  const finishHometask = trpc.hometask.finish.useQuery({ id: item.id });

  return (
    <div className={`${CARD} my-4`}>
      <div className="w-full">
        <Link href={`/workspace/hometasks/${item.id}`} className="text-xl">
          {item.title}
        </Link>
        <p className="text-gray-400">{item.content?.slice(0, 50)}</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="font-semibold">{item.topic.name}</p>
        <p>{item.due?.toLocaleDateString()}</p>
      </div>
    </div>
  );
};
