import type { Room, Topic } from "@prisma/client";
import type { Session } from "next-auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ACTION_BUTTON,
  CARD,
  DELETE_BUTTON,
  INPUT_SELECT,
  INPUT_TEXT,
  LABEL,
} from "styles";
import { trpc } from "utils/trpc";

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

export default function EditRoom({
  data,
  topics,
  session,
  router,
}: EditRoomProps) {
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
  const joinRoom = trpc.useMutation("participant.join");
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
        {session && (
          <button
            className={ACTION_BUTTON}
            onClick={() =>
              joinRoom.mutate({ userId: session.user?.id || "", roomId: id })
            }
          >
            Join
          </button>
        )}
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
      <div className={`my-4 flex items-center justify-center ${CARD}`}>
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
            <p className="text-red-500">{editRoom.error.message}</p>
          )}
        </form>
      </div>
    </>
  );
}
