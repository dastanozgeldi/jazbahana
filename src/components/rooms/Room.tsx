import type {
  ParticipantsInRooms,
  Room as RoomType,
  Topic,
} from "@prisma/client";
import Link from "next/link";
import { IoPeople } from "react-icons/io5";
import { TOPIC } from "styles";
import Avatar from "../Avatar";

type RoomProps = {
  data: RoomType & { participants: ParticipantsInRooms[]; topic: Topic | null };
};

const Room = ({ data }: RoomProps) => {
  return (
    <article
      className="my-2 flex gap-2 flex-col text-[#202020] bg-neutral-100 dark:text-neutral-100 dark:bg-[#202020] p-4 rounded-xl"
      key={data.id}
    >
      <div className="flex items-center justify-between">
        <Link href={`/users/${data.authorId || "ghost"}`}>
          <a className="flex items-center gap-2 font-medium">
            <Avatar src={data.authorImage} size={32} />
            <span>{data.authorName || "ghost"}</span>
          </a>
        </Link>
        <p className="text-gray-500">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
      </div>
      <Link href={`/rooms/${data.id}`}>
        <a className="max-w-max text-2xl font-semibold">{data.title}</a>
      </Link>
      <p className="text-gray-400">{data.description}</p>
      <div className="my-2 flex justify-between">
        <span className={`${TOPIC} flex items-center gap-2`}>
          <IoPeople className="w-5 h-5" />
          {data.participants.length} participants
        </span>
        {data.topic && (
          <span
            className={`${TOPIC} flex items-center gap-2`}
            key={data.topicId}
          >
            {data.topic.image && (
              <img src={data.topic.image} className="w-4 h-4" />
            )}
            {data.topic.name}
          </span>
        )}
      </div>
    </article>
  );
};

export default Room;
