import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

type FormData = {
  title: string;
  description: string;
  topicId: string;
};

const RoomViewPage = () => {
  // Form
  const { register, handleSubmit, reset } = useForm<FormData>();
  // Router
  const { push, query } = useRouter();
  const id = query.id as string;
  // Session
  const { data: session } = useSession();
  // States
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [topicId, setTopicId] = useState<string | null | undefined>("");
  const [editing, setEditing] = useState(false);
  // tRPC
  const utils = trpc.useContext();
  const roomQuery = trpc.useQuery(["room.byId", { id }]);
  const { data: topics } = trpc.useQuery(["topic.all"]);
  const editRoom = trpc.useMutation("room.edit", {
    async onSuccess() {
      await utils.invalidateQueries(["room.byId", { id }]);
    },
  });
  const deleteRoom = trpc.useMutation("room.delete", {
    async onSuccess() {
      push("/feed");
      await utils.invalidateQueries(["room.all"]);
    },
  });
  const { data: room } = roomQuery;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editRoom.mutateAsync({
        id: room?.id || "",
        data: {
          title: title || "",
          description: description || "",
          topicId: topicId || "",
        },
      });
    } catch {}
  });

  useEffect(() => {
    setTitle(room?.title);
    setDescription(room?.description);
    setTopicId(room?.topicId);
  }, []);

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
        <div className="flex gap-2 my-2">
          {session?.user?.id === room.authorId && (
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
      </div>

      {/* Message Section using WebSockets */}

      {/* Edit Room */}
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

          <div className="my-4">
            <label className={LABEL} htmlFor="description">
              Subtitle:
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
          {/* Topics */}
          <div className="my-4">
            <label className={LABEL} htmlFor="topic">
              Topic:
            </label>
            <select
              {...register("topicId")}
              id="topicId"
              className={INPUT_SELECT}
              onChange={(e) => setTopicId(e.currentTarget.value)}
            >
              <option selected>Choose a topic</option>
              {topics &&
                topics.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            className="py-2 px-4 rounded-md text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
            type="submit"
            disabled={editRoom.isLoading}
          >
            Save
          </button>
          {editRoom.error && (
            <p style={{ color: "red" }}>{editRoom.error.message}</p>
          )}
        </form>
      </div>
    </Page>
  );
};

export default RoomViewPage;
