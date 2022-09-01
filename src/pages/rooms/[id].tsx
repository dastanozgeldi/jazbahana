import type { Room, Topic } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Page from "../../components/layouts/Page";
import {
  ACTION_BUTTON,
  CARD,
  DELETE_BUTTON,
  INPUT_SELECT,
  INPUT_TEXT,
  LABEL,
} from "../../styles";
import { trpc } from "../../utils/trpc";

const RoomViewPage = () => {
  // Router
  const router = useRouter();
  const id = router.query.id as string;
  // Session
  const { data: session } = useSession();
  // tRPC
  const roomQuery = trpc.useQuery(["room.byId", { id }]);
  const { data: room } = roomQuery;
  const { data: topics } = trpc.useQuery(["topic.all"]);

  // room fetch fail
  if (roomQuery.error) {
    return (
      <NextError
        title={roomQuery.error.message}
        statusCode={roomQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!room || roomQuery.status !== "success") {
    return <>Loading...</>;
  }
  return (
    <Page title={room.title} className="max-w-[60ch] mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-extrabold">{room.title}</h1>
      <p className="my-2">{room.description}</p>
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-400">
          Created {room.createdAt.toLocaleDateString("en-us")}
        </p>
      </div>

      {/* Message Section using WebSockets */}

      <EditRoom data={room} topics={topics} session={session} router={router} />
    </Page>
  );
};

type EditRoomProps = {
  data?: Room | null;
  topics?: Topic[] | null;
  session?: Session | null;
  router: any;
};

type FormData = {
  id: string;
  title: string;
  description: string;
  topicId: string;
};

const EditRoom = ({ data, topics, session, router }: EditRoomProps) => {
  const id = router.query.id as string;
  const topic = topics?.find((t: Topic) => t.id === data?.topicId);
  const [editing, setEditing] = useState(false);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const utils = trpc.useContext();
  const editRoom = trpc.useMutation("room.edit", {
    async onSuccess() {
      await utils.invalidateQueries(["room.byId", { id }]);
    },
  });
  const deleteRoom = trpc.useMutation("room.delete", {
    async onSuccess() {
      router.push("/feed");
      await utils.invalidateQueries(["room.all"]);
    },
  });
  // States
  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [topicId, setTopicId] = useState(data?.topicId);

  const onSubmit = handleSubmit(async () => {
    try {
      await editRoom.mutateAsync({
        id: data?.id || "",
        data: {
          title: title || "",
          description: description || "",
          topicId: topicId || "",
        },
      });
    } catch {}
  });

  return (
    <>
      <div className="flex gap-2 my-2">
        {session?.user?.id === data?.authorId && (
          <>
            <button
              className={ACTION_BUTTON}
              onClick={() => setEditing(!editing)}
            >
              Edit
            </button>
            <button
              className={DELETE_BUTTON}
              onClick={() => deleteRoom.mutate({ id })}
            >
              Delete
            </button>
          </>
        )}
      </div>
      <div className={`my-10 flex items-center justify-center ${CARD}`}>
        <form hidden={!editing} className="w-[90%]" onSubmit={onSubmit}>
          <h2 className="text-center text-3xl font-bold mb-2">Edit Room</h2>
          <div>
            <label className={LABEL} htmlFor="title">
              Title:
            </label>
            <input
              id="title"
              {...register("title")}
              className={INPUT_TEXT}
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              disabled={editRoom.isLoading}
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
              className={INPUT_TEXT}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              disabled={editRoom.isLoading}
            />
          </div>
          {/* Topic */}
          <div className="my-4">
            <label className={LABEL} htmlFor="topicId">
              Topic:
            </label>
            <select
              {...register("topicId")}
              id="topicId"
              className={INPUT_SELECT}
              onChange={(e) => setTopicId(e.currentTarget.value)}
            >
              {topic ? (
                <option value={topic.id}>{topic.name}</option>
              ) : (
                <option selected>Choose a topic</option>
              )}
              {topics &&
                topics.map((t: Topic) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
          {/* Save */}
          <button
            className="py-2 px-4 rounded-md text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
            onClick={() => console.log(topic)}
            disabled={editRoom.isLoading}
          >
            Save
          </button>
          {/* Error occurred */}
          {editRoom.error && (
            <p style={{ color: "red" }}>{editRoom.error.message}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default RoomViewPage;
