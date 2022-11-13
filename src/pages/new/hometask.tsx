import { Topic } from "@prisma/client";
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
  content: string;
  topicId: string;
  due: Date;
};

const NewHometask = () => {
  const [topicId, setTopicId] = useState("");
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const { data: session } = useSession();
  const { data: topics } = trpc.useQuery(["topic.all"]);
  const utils = trpc.useContext();
  const addHometask = trpc.useMutation("hometask.add", {
    async onSuccess() {
      router.back();
      await utils.invalidateQueries(["hometask.infinite"]);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addHometask.mutateAsync({
        ...data,
        userId: session?.user?.id || "",
        topicId,
        due: new Date(data.due),
      });
    } catch {}
  });

  return (
    <div className={`${CARD} justify-center my-4 max-w-[48ch] mx-auto`}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-3 items-center mb-3">
          <Link href="/">
            <a className="w-max p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:duration-500">
              <AiOutlineArrowLeft size={24} />
            </a>
          </Link>
          <h2 className="text-center text-2xl">New Hometask</h2>
        </div>
        {/* Title */}
        <div className="my-2">
          <label className="text-xl" htmlFor="title">
            Title:
          </label>
          <input
            id="title"
            {...register("title")}
            type="text"
            className={INPUT_TEXT}
            disabled={addHometask.isLoading}
          />
        </div>
        {/* Content */}
        <div className="my-2">
          <label className="text-xl" htmlFor="content">
            Content:
          </label>
          <textarea
            id="content"
            {...register("content")}
            className={INPUT_TEXT}
            disabled={addHometask.isLoading}
          />
        </div>
        {/* Topic */}
        <div className="my-2">
          <label className="text-xl" htmlFor="topic">
            Topic:
          </label>
          <select
            {...register("topicId")}
            id="topic"
            className={INPUT_SELECT}
            onChange={(e) => setTopicId(e.currentTarget.value)}
          >
            <option selected>Click to choose</option>
            {topics &&
              topics.map((t: Topic) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </div>
        {/* Due Date */}
        <div className="my-2">
          <label className="text-xl block" htmlFor="topic">
            Due Date:
          </label>
          <input
            {...register("due")}
            id="dueDate"
            type="date"
            className={INPUT_TEXT}
          />
        </div>
        {/* Submit Form */}
        <button
          className={`${ACTION_BUTTON} my-4`}
          type="submit"
          disabled={addHometask.isLoading}
        >
          Add
        </button>
        {/* Validation Error */}
        {addHometask.error && (
          <p className="text-red-500">{addHometask.error.message}</p>
        )}
      </form>
    </div>
  );
};

export default NewHometask;
