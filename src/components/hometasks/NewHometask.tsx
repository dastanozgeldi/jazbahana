import { Dialog, Transition } from "@headlessui/react";
import { Topic } from "@prisma/client";
import { useSession } from "next-auth/react";
import { type Dispatch, Fragment, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { ACTION_BUTTON, INPUT_SELECT, INPUT_TEXT } from "styles";
import { trpc } from "utils/trpc";

type FormData = {
  title: string;
  content: string;
  topicId: string;
  due: Date;
};

type NewHometaskProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const NewHometask = ({ isOpen, setIsOpen }: NewHometaskProps) => {
  const [topicId, setTopicId] = useState("");
  const { register, handleSubmit } = useForm<FormData>();
  const { data: session } = useSession();
  const { data: topics } = trpc.topic.all.useQuery();
  const utils = trpc.useContext();
  const addHometask = trpc.hometask.add.useMutation({
    async onSuccess() {
      setIsOpen(false);
      await utils.hometask.infinite.invalidate();
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-50 dark:bg-[#111] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h2"
                  className="text-xl font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Create Hometask
                </Dialog.Title>
                <form onSubmit={onSubmit}>
                  <div className="grid grid-cols-3 items-center mb-3"></div>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
