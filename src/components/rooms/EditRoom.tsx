import type { Room, Topic } from "@prisma/client";
import { Modal } from "components/common/Modal";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ACTION_BUTTON, DELETE_BUTTON, INPUT_SELECT, INPUT_TEXT } from "styles";
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

export const EditRoom = ({ data, topics, session, router }: EditRoomProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = router.query.id as string;
  const userId = session?.user?.id as string;
  const topic = topics?.find((t: Topic) => t.id === data?.topicId);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const utils = trpc.useContext();
  const { data: hasJoined } = trpc.participant.hasJoined.useQuery({
    roomId: id,
    userId,
  });
  const isPinned = data?.isPinned || false;
  const editRoom = trpc.room.edit.useMutation({
    async onSuccess() {
      await utils.room.byId.invalidate({ id });
      setIsOpen(false);
    },
  });
  const deleteRoom = trpc.room.delete.useMutation({
    async onSuccess() {
      router.push("/feed");
    },
  });
  const joinRoom = trpc.participant.join.useMutation({
    async onSuccess() {
      await utils.participant.hasJoined.invalidate({ roomId: id, userId });
      await utils.participant.all.invalidate();
    },
  });
  const pinRoom = trpc.room.pin.useMutation({
    async onSuccess() {
      await utils.room.invalidate();
    },
  });
  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topicId, setTopicId] = useState("");

  const onSubmit = handleSubmit(async () => {
    try {
      await editRoom.mutateAsync({
        id,
        data: {
          title,
          description,
          topicId,
        },
      });
    } catch {}
  });

  useEffect(() => {
    setTitle(data?.title || "");
    setDescription(data?.description || "");
    setTopicId(data?.topicId || "");
  }, []);

  return (
    <>
      <div className="flex gap-2 my-2">
        {session && (
          <>
            <button
              disabled={data?.isPinned}
              className={ACTION_BUTTON}
              onClick={() => pinRoom.mutate({ roomId: id, isPinned })}
            >
              {data?.isPinned ? "Pinned" : "Pin"}
            </button>
            <button
              disabled={hasJoined}
              className={ACTION_BUTTON}
              onClick={() => joinRoom.mutate({ userId, roomId: id })}
            >
              {hasJoined ? "Joined" : "Join"}
            </button>
          </>
        )}
        {userId === data?.userId && (
          <>
            <button className={ACTION_BUTTON} onClick={() => setIsOpen(true)}>
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

      <Modal title="Edit Room" isOpen={isOpen} setIsOpen={setIsOpen}>
        <form hidden={!isOpen} className="w-[90%]" onSubmit={onSubmit}>
          <div className="my-4">
            <label className="text-lg" htmlFor="title">
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
            <label className="text-lg" htmlFor="description">
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
            <label className="text-lg" htmlFor="topicId">
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
            className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 hover:duration-500"
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
      </Modal>
    </>
  );
};
