import type { Topic } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { ACTION_BUTTON, CARD, INPUT_SELECT, INPUT_TEXT } from "styles";
import { trpc } from "utils/trpc";

type FormData = {
  title: string;
  description: string;
  topic: object;
};

const NewRoom = () => {
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<FormData>();
  const authorId = session?.user?.id as string;
  const [topicId, setTopicId] = useState("");
  const router = useRouter();
  const utils = trpc.useContext();
  const { data } = trpc.topic.all.useQuery();
  const addRoom = trpc.room.add.useMutation({
    async onSuccess() {
      router.back();
      await utils.room.infinite.invalidate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addRoom.mutateAsync({
        ...data,
        authorId,
        topicId,
      });
    } catch {}
  });

  if (!session) return <>Yo u gotta sign in</>;
  return (
    <div className="min-h-screen flex items-center">
      <div className={`${CARD} justify-center my-4 max-w-[48ch] mx-auto`}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-3 items-center mb-3">
            <Link
              href="/"
              className="w-max p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500"
            >
              <AiOutlineArrowLeft size={24} />
            </Link>
            <h2 className="text-center text-2xl">New Room</h2>
          </div>
          {/* Title */}
          <div>
            <label className="text-xl" htmlFor="title">
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
            <label className="text-xl" htmlFor="description">
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
            <label className="text-xl" htmlFor="topic">
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
      </div>
    </div>
  );
};

export default NewRoom;
