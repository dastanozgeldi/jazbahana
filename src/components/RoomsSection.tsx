import { Room as RoomType, TopicsInRooms } from "@prisma/client";
import type { Session } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ACTION_BUTTON,
  CARD,
  INPUT_SELECT,
  INPUT_TEXT,
  LABEL,
  POST,
  TOPIC,
} from "../styles";
import { trpc } from "../utils/trpc";

type RoomSectionProps = {
  session: Session | null;
  roomsQuery: any;
  profilePage?: boolean;
};
type AddRoomProps = { adding: boolean; profilePage: boolean; session: Session };
type RoomProps = { data: RoomType & { topics: TopicsInRooms[] } };

export default function RoomsSection({
  session,
  roomsQuery,
  profilePage = false,
}: RoomSectionProps) {
  const [adding, setAdding] = useState(false);

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
        <AddRoom adding={adding} profilePage={profilePage} session={session} />
      )}

      {roomsQuery.data?.map((room: RoomType & { topics: TopicsInRooms[] }) => (
        <Room key={room.id} data={room} />
      ))}
    </div>
  );
}

type FormData = {
  title: string;
  description: string;
  topics: [{ name: string; image: string; topicId: string }];
};

export const AddRoom = ({ adding, profilePage, session }: AddRoomProps) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [topics, setTopics] = useState<any>([]);
  const utils = trpc.useContext();
  const addRoom = trpc.useMutation("room.add", {
    async onSuccess() {
      // refetches all rooms after successful post add
      if (profilePage) {
        await utils.invalidateQueries(["user.rooms"]);
      } else {
        await utils.invalidateQueries(["room.all"]);
      }
      reset();
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    try {
      data.topics;
      await addRoom.mutateAsync({
        ...data,
        authorName: session.user?.name || "unknown",
        authorImage: session.user?.image || "/default-avatar.png",
        authorId: session.user?.id || "",
        topics: [],
      });
    } catch {}
  });
  const { data } = trpc.useQuery(["topic.all"]);

  return (
    <div className={`flex items-center justify-center my-4 ${CARD}`}>
      <form hidden={!adding} className="w-[90%] mx-auto" onSubmit={onSubmit}>
        <h2 className="text-center text-3xl font-bold mb-2">Add Post</h2>
        {/* Title */}
        <div>
          <label className={LABEL} htmlFor="title">
            Title:
          </label>
          <br />
          <input
            id="title"
            {...register("title")}
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
            {...register("description")}
            type="text"
            className={INPUT_TEXT}
            disabled={addRoom.isLoading}
          />
        </div>
        {/* Topics */}
        <div>
          <label className={LABEL} htmlFor="topics">
            Topics
          </label>
          <select
            multiple
            {...register("topics")}
            id="topics"
            className={INPUT_SELECT}
          >
            <option selected>Choose topics</option>
            {data &&
              data.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  onChange={() => {
                    console.log(topics);
                    setTopics([
                      ...topics,
                      {
                        topicId: t.id,
                        name: t.name,
                        image: t.image,
                      },
                    ]);
                  }}
                >
                  {t.name}
                </option>
              ))}
          </select>
        </div>
        {/* Submit Form */}
        <button
          className={`${ACTION_BUTTON} my-4`}
          type="submit"
          disabled={addRoom.isLoading}
        >
          Submit
        </button>
        {/* Validation Error */}
        {addRoom.error && (
          <p className="text-red-500">{addRoom.error.message}</p>
        )}
      </form>
    </div>
  );
};

export const Room = ({ data }: RoomProps) => {
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
      <Link href={`/rooms/${data.id}`}>
        <a className="text-2xl font-semibold">{data.title}</a>
      </Link>
      <p className="text-gray-400">{data.description}</p>
      <div className="my-2 flex justify-end">
        {data.topics?.length > 0 &&
          data.topics.map((t) => (
            <span className={TOPIC} key={t.topicId}>
              {t.name}
            </span>
          ))}
      </div>
    </article>
  );
};
