import { Dialog, Transition } from "@headlessui/react";
import type { Topic } from "@prisma/client";
import { useSession } from "next-auth/react";
import { type Dispatch, Fragment, type SetStateAction, useState } from "react";
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
                  Create Room
                </Dialog.Title>
                <form className="py-4 space-y-4" onSubmit={onSubmit}>
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
                  <div>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
