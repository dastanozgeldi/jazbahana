import type { Topic } from "@prisma/client";
import { Modal } from "components/common/Modal";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { ACTION_BUTTON, INPUT_SELECT, INPUT_TEXT } from "styles";
import { trpc } from "utils/trpc";

type FormData = {
  title: string;
  description: string;
  topic: object;
};

type NewRoomProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const NewRoom = ({ isOpen, setIsOpen }: NewRoomProps) => {
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<FormData>();
  const userId = session?.user?.id as string;
  const [topicId, setTopicId] = useState("");
  const utils = trpc.useContext();
  const { data } = trpc.topic.all.useQuery();
  const addRoom = trpc.room.add.useMutation({
    async onSuccess() {
      setIsOpen(false);
      await utils.room.infinite.invalidate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addRoom.mutateAsync({
        ...data,
        userId,
        topicId,
      });
    } catch {}
  });

  if (!session) return <>Yo u gotta sign in</>;
  return (
    <Modal title="Create Room" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className="py-4 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-lg" htmlFor="title">
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
        <div>
          <label className="text-lg" htmlFor="description">
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
          <label className="text-lg" htmlFor="topic">
            Topic:
          </label>
          <select
            {...register("topic")}
            id="topic"
            className={INPUT_SELECT}
            onChange={(e) => setTopicId(e.currentTarget.value)}
          >
            <option selected>Click to choose</option>
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
          Add
        </button>
        {/* Validation Error */}
        {addRoom.error && (
          <p className="text-red-500">{addRoom.error.message}</p>
        )}
      </form>
    </Modal>
  );
};
