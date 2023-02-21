import type { Hometask, Topic } from "@prisma/client";
import { Modal } from "components/common/Modal";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ACTION_BUTTON, DELETE_BUTTON, INPUT_SELECT, INPUT_TEXT } from "styles";
import { trpc } from "utils/trpc";

type EditHometaskProps = {
  hometask?: Hometask | null;
  topics?: Topic[] | null;
  session?: Session | null;
  router: any;
};

type FormData = {
  id: string;
  title: string;
  content: string;
  topicId: string;
};

export const EditHometask = ({
  hometask,
  topics,
  session,
  router,
}: EditHometaskProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = router.query.id as string;
  const userId = session?.user?.id as string;
  const topic = topics?.find((t: Topic) => t.id === hometask?.topicId);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const utils = trpc.useContext();

  const finishHometask = trpc.hometask.finish.useMutation({
    async onSuccess() {
      await utils.hometask.byId.invalidate({ id });
    },
  });

  const editHometask = trpc.hometask.edit.useMutation({
    async onSuccess() {
      await utils.hometask.byId.invalidate({ id });
      setIsOpen(false);
    },
  });

  const deleteHometask = trpc.hometask.delete.useMutation({
    async onSuccess() {
      router.push("/workspace/hometasks");
    },
  });

  // States
  const [title, setTitle] = useState("");
  const [content, setDescription] = useState("");
  const [topicId, setTopicId] = useState("");

  const onSubmit = handleSubmit(async () => {
    try {
      await editHometask.mutateAsync({
        id,
        data: {
          title,
          content,
          topicId,
        },
      });
    } catch {}
  });

  useEffect(() => {
    setTitle(hometask?.title || "");
    setDescription(hometask?.content || "");
    setTopicId(hometask?.topicId || "");
  }, []);

  return (
    <>
      <div className="flex gap-2 my-2">
        {userId === hometask?.userId && (
          <>
            <button
              className={ACTION_BUTTON}
              onClick={() => finishHometask.mutate({ id })}
            >
              Finish
            </button>
            <button className={ACTION_BUTTON} onClick={() => setIsOpen(true)}>
              Edit
            </button>
            <button
              className={DELETE_BUTTON}
              onClick={() => deleteHometask.mutate({ id })}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <Modal title="Edit Hometask" isOpen={isOpen} setIsOpen={setIsOpen}>
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
              disabled={editHometask.isLoading}
            />
          </div>
          {/* Content */}
          <div className="my-4">
            <label className="text-lg" htmlFor="content">
              Content:
            </label>
            <input
              id="content"
              {...register("content")}
              className={INPUT_TEXT}
              value={content}
              onChange={(e) => setDescription(e.currentTarget.value)}
              disabled={editHometask.isLoading}
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
            className="py-2 px-4 rounded-md text-white bg-primary hover:bg-blue-600 hover:duration-500"
            onClick={() => console.log(topic)}
            disabled={editHometask.isLoading}
          >
            Save
          </button>
          {/* Error occurred */}
          {editHometask.error && (
            <p className="text-red-500">{editHometask.error.message}</p>
          )}
        </form>
      </Modal>
    </>
  );
};
