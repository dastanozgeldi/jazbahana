import { Room as RoomType, TopicsInRooms } from "@prisma/client";
import type { Session } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { ACTION_BUTTON, CARD, INPUT_TEXT, LABEL, POST, TOPIC } from "../styles";
import { trpc } from "../utils/trpc";

type AddRoomProps = { adding: boolean; addRoom: any; session: Session };
type RoomSectionProps = {
  session: Session | null;
  roomsQuery: any;
  profilePage?: boolean;
};

export default function RoomsSection({
  session,
  roomsQuery,
  // TODO: make use at /profile page.
  // TODO: create user.posts router
  profilePage = false,
}: RoomSectionProps) {
  const [adding, setAdding] = useState(false);

  const utils = trpc.useContext();
  const addRoom = trpc.useMutation("room.add", {
    async onSuccess() {
      // refetches all rooms after successful post add
      if (profilePage) {
        await utils.invalidateQueries(["user.rooms"]);
      } else {
        await utils.invalidateQueries(["room.all"]);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between px-2">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <span className="text-gray-400">
            {roomsQuery.data?.length} available
          </span>
        </div>

        {session && (
          <>
            <button
              className={ACTION_BUTTON}
              onClick={() => setAdding(!adding)}
            >
              Add Post
            </button>
          </>
        )}
      </div>
      {session && (
        <AddRoom adding={adding} addRoom={addRoom} session={session} />
      )}

      {roomsQuery.data?.map((room: RoomType & { topics: TopicsInRooms[] }) => (
        <Room key={room.id} data={room} />
      ))}
    </div>
  );
}

export const AddRoom = ({ adding, addRoom, session }: AddRoomProps) => {
  return (
    <div className={`flex items-center justify-center my-4 ${CARD}`}>
      <form
        hidden={!adding}
        className="w-[90%] mx-auto"
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @link https://react-hook-form.com/
           */

          const $title: HTMLInputElement = (e as any).target.elements.title;
          const $description: HTMLInputElement = (e as any).target.elements
            .description;
          const input = {
            title: $title.value,
            description: $description.value,
            authorName: session.user?.name,
            authorImage: session.user?.image,
            authorId: session.user?.id,
          };
          try {
            await addRoom.mutateAsync(input);

            $title.value = "";
            $description.value = "";
          } catch {}
        }}
      >
        <h2 className="text-center text-3xl font-bold mb-2">Add Post</h2>
        {/* Title */}
        <div>
          <label className={LABEL} htmlFor="title">
            Title:
          </label>
          <br />
          <input
            id="title"
            name="title"
            type="text"
            className={INPUT_TEXT}
            disabled={addRoom.isLoading}
          />
        </div>
        {/* Subtitle */}
        <div className="my-4">
          <label className={LABEL} htmlFor="description">
            Description:
          </label>
          <br />
          <input
            id="description"
            name="description"
            type="text"
            className={INPUT_TEXT}
            disabled={addRoom.isLoading}
          />
        </div>

        {/* TODO: SELECT FIELD FOR TOPICS [topic.all] */}

        <button
          className={ACTION_BUTTON}
          type="submit"
          disabled={addRoom.isLoading}
        >
          Submit
        </button>
        {addRoom.error && (
          <p style={{ color: "red" }}>{addRoom.error.message}</p>
        )}
      </form>
    </div>
  );
};

export const Room = ({
  data,
}: {
  data: RoomType & { topics: TopicsInRooms[] };
}) => {
  return (
    <article className={POST} key={data.id}>
      <div className="flex items-center justify-between">
        <Link href={`/users/${data.authorId || "ghost"}`}>
          <a className="flex items-center gap-2 font-medium">
            <img
              src={data.authorImage || "/default-avatar.png"}
              width={32}
              height={32}
              alt="avatar"
              className="rounded-full"
            />
            <span>{data.authorName || "ghost"}</span>
          </a>
        </Link>
        <p className="text-gray-500">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
      </div>
      <h3 className="text-2xl font-semibold">{data.title}</h3>
      <p className="text-gray-400">{data.description}</p>
      <div className="my-2">
        {data.topics?.length > 0 &&
          data.topics.map((t) => (
            <span className={TOPIC} key={t.topicId}>
              {t.name}
            </span>
          ))}
      </div>
      <Link href={`/rooms/${data.id}`}>
        <a className="text-teal-400 hover:text-teal-500 duration-500">
          View more
        </a>
      </Link>
    </article>
  );
};
