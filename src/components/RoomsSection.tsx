import type {
  ParticipantsInRooms,
  Room as RoomType,
  Topic,
} from "@prisma/client";
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
  TOPIC,
} from "../styles";
import { trpc } from "../utils/trpc";
import { IoAdd, IoPeople } from "react-icons/io5";
import Avatar from "./Avatar";
import { useRouter } from "next/router";

type RoomSectionProps = {
  session: Session | null;
  profilePage?: boolean;
};

type AddRoomProps = {
  adding: boolean;
  profilePage: boolean;
  session: Session;
  topicsQuery: any;
};

type RoomProps = {
  data: RoomType & { participants: ParticipantsInRooms[] };
  topicsQuery: any;
};

export default function RoomsSection({
  session,
  profilePage = false,
}: RoomSectionProps) {
  const [adding, setAdding] = useState(false);
  const topicsQuery = trpc.useQuery(["topic.all"]);
  const { query } = useRouter();
  const page = query.page ? Number(query.page) - 1 : 0;

  const topicId = query.topicId as string;

  const { data } = topicId
    ? trpc.useInfiniteQuery(
        ["room.infiniteByTopicId", { limit: 10, topicId }],
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          getPreviousPageParam: () => page - 1,
        }
      )
    : trpc.useInfiniteQuery(["room.infinite", { limit: 10 }], {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        getPreviousPageParam: () => page - 1,
      });
  const rooms = data?.pages[page]?.items;

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <span className="text-gray-400">{rooms?.length} available</span>
        </div>

        {session && (
          <>
            <button
              className={`${ACTION_BUTTON} flex items-center gap-2`}
              onClick={() => setAdding(!adding)}
            >
              <IoAdd className="w-6 h-6" /> Add Room
            </button>
          </>
        )}
      </div>
      {session && (
        <AddRoom
          topicsQuery={topicsQuery}
          adding={adding}
          profilePage={profilePage}
          session={session}
        />
      )}

      {rooms?.map((room) => (
        <Room key={room.id} topicsQuery={topicsQuery} data={room} />
      ))}
      {/* Pagination */}
      {data?.pages && data?.pages.length > 0 && (
        <div className="flex justify-between">
          <button className={ACTION_BUTTON}>previous page</button>
          <button className={ACTION_BUTTON}>next page</button>
        </div>
      )}
    </div>
  );
}

type FormData = {
  title: string;
  description: string;
  topic: object;
};

export const AddRoom = ({
  adding,
  profilePage,
  session,
  topicsQuery,
}: AddRoomProps) => {
  const { data } = topicsQuery;
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [topicId, setTopicId] = useState<string>("");
  const utils = trpc.useContext();
  const addRoom = trpc.useMutation("room.add", {
    async onSuccess() {
      // refetches all rooms after successful add
      await utils.invalidateQueries(["room.infinite"]);
      reset();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addRoom.mutateAsync({
        ...data,
        authorName: session.user?.name || "unknown",
        authorImage: session.user?.image || "/default-avatar.png",
        authorId: session.user?.id || "",
        topicId,
      });
    } catch {}
  });

  return (
    <div className={`flex items-center justify-center my-4 ${CARD}`}>
      <form hidden={!adding} className="w-[90%] mx-auto" onSubmit={onSubmit}>
        <h2 className="text-center text-3xl font-bold mb-2">Add Room</h2>
        {/* Title */}
        <div>
          <label className={LABEL} htmlFor="title">
            Title:
          </label>
          <input
            id="title"
            {...register("title")}
            type="text"
            className={INPUT_TEXT}
            disabled={addRoom.isLoading}
          />
        </div>
        {/* Description */}
        <div className="my-4">
          <label className={LABEL} htmlFor="description">
            Description:
          </label>
          <input
            id="description"
            {...register("description")}
            type="text"
            className={INPUT_TEXT}
            disabled={addRoom.isLoading}
          />
        </div>
        {/* Topic */}
        <div>
          <label className={LABEL} htmlFor="topic">
            Topic:
          </label>
          <select
            {...register("topic")}
            id="topic"
            className={INPUT_SELECT}
            onChange={(e) => setTopicId(e.currentTarget.value)}
          >
            <option selected>Choose a topic</option>
            {data &&
              data.map((t: Topic) => (
                <option key={t.id} value={t.id}>
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

export const Room = ({ data, topicsQuery }: RoomProps) => {
  const { data: topics } = topicsQuery;
  const topic = topics.find((t: Topic) => t.id === data.topicId);

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
        {topic && (
          <span
            className={`${TOPIC} flex items-center gap-2`}
            key={data.topicId}
          >
            {topic.image && <img src={topic.image} className="w-4 h-4" />}
            {topic.name}
          </span>
        )}
      </div>
    </article>
  );
};
