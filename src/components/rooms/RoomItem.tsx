import { type Room } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { IoPeople } from "react-icons/io5";
import { TOPIC } from "styles";
import { Avatar } from "../common/Avatar";

type RoomItemProps = {
  room: Room & {
    user?: any;
    participants?: any;
    topic?: any;
  };
};

export const RoomItem = ({ room }: RoomItemProps) => {
  return (
    <article
      className="my-2 flex gap-2 flex-col border-[1px] border-gray-700 p-4 rounded-xl"
      key={room.id}
    >
      <div className="flex items-center justify-between">
        <Link
          href={`/users/${room.user?.id || "ghost"}`}
          className="flex items-center gap-2 font-medium"
        >
          <Avatar src={room.user?.image} size={32} />
          <span>{room.user?.name || "ghost"}</span>
        </Link>
        <p className="text-gray-500">{`${room.updatedAt.toLocaleDateString()}, ${room.updatedAt.toLocaleTimeString()}`}</p>
      </div>
      <Link
        href={`/rooms/${room.id}`}
        className="max-w-max text-2xl font-semibold"
      >
        {room.title}
      </Link>
      <p className="text-gray-400">{room.description}</p>
      <div className="my-2 flex justify-between">
        {room.participants && (
          <span className={`${TOPIC} flex items-center gap-2`}>
            <IoPeople className="w-5 h-5" />
            {room.participants.length} participants
          </span>
        )}
        {room.topic && (
          <span
            className={`${TOPIC} flex items-center gap-2`}
            key={room.topicId}
          >
            {room.topic.image && (
              <Image
                alt="Topic"
                src={room.topic.image}
                width={16}
                height={16}
              />
            )}
            {room.topic.name}
          </span>
        )}
      </div>
    </article>
  );
};
