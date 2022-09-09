import type { Room, Topic } from "@prisma/client";
import Avatar from "components/Avatar";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import NextError from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
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

export default function RoomViewPage() {
  // Router
  const router = useRouter();
  const id = router.query.id as string;
  // Session
  const { data: session } = useSession();
  // tRPC
  const roomQuery = trpc.useQuery(["room.byId", { id }]);
  const { data: room } = roomQuery;
  const { data: topics } = trpc.useQuery(["topic.all"]);

  const messagesQuery = trpc.useInfiniteQuery(
    ["message.infinite", { roomId: room?.id || "" }],
    {
      getPreviousPageParam: (d) => d.prevCursor,
    }
  );
  const utils = trpc.useContext();
  const { hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage } =
    messagesQuery;

  const [messages, setMessages] = useState(() => {
    const msgs = messagesQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type Message = NonNullable<typeof messages>[number];
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // fn to add and dedupe new messages onto state
  const addMessages = useCallback((incoming?: Message[]) => {
    setMessages((current) => {
      const map: Record<Message["id"], Message> = {};
      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
  }, []);

  // when new data from `useInfiniteQuery`, merge with current state
  useEffect(() => {
    const msgs = messagesQuery.data?.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [messagesQuery.data?.pages, addMessages]);

  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current == null) {
      return;
    }

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [scrollTargetRef]);

  useEffect(() => {
    scrollToBottomOfList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // subscribe to new messages and add
  trpc.useSubscription(["message.onAdd"], {
    onNext(message) {
      addMessages([message]);
    },
    onError(err) {
      console.error("Subscription error:", err);
      // we might have missed a message - invalidate cache
      utils.queryClient.invalidateQueries();
    },
  });

  const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);
  trpc.useSubscription(["message.whoIsTyping"], {
    onNext(data) {
      setCurrentlyTyping(data);
    },
  });

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

      {/* Messages */}
      <div className={CARD}>
        <section className="h-full flex flex-col justify-end space-y-4">
          <div className="overflow-y-auto space-y-4">
            <button
              data-testid="loadMore"
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage || isFetchingPreviousPage}
              className="px-4 bg-indigo-500 rounded py-2 disabled:opacity-40 text-white"
            >
              {isFetchingPreviousPage
                ? "Loading more..."
                : hasPreviousPage
                ? "Load More"
                : "Nothing more to load"}
            </button>
            <div className="space-y-4">
              {messages?.map((item) => (
                <article key={item.id} className=" text-gray-50">
                  <header className="flex items-center space-x-2 text-sm">
                    <Link href={`/users/${item.authorId || "ghost"}`}>
                      <a className="flex items-center gap-1">
                        <Avatar size={28} src={item.authorImage} />
                        <h3 className="text-md">{item.authorName}</h3>
                      </a>
                    </Link>
                    <span className="text-gray-500">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(item.createdAt)}
                    </span>
                  </header>
                  <p className="text-xl leading-tight whitespace-pre-line">
                    {item.content}
                  </p>
                </article>
              ))}
              <div ref={scrollTargetRef}></div>
            </div>
          </div>
          <div className="w-full">
            <AddMessageForm
              roomId={room.id}
              session={session}
              onMessagePost={() => scrollToBottomOfList()}
            />
            <p className="h-2 italic text-gray-400">
              {currentlyTyping.length
                ? `${currentlyTyping.join(", ")} typing...`
                : ""}
            </p>
          </div>

          {/* {process.env.NODE_ENV !== "production" && (
            <div className="hidden md:block">
              <ReactQueryDevtools initialIsOpen={false} />
            </div>
          )} */}
        </section>
      </div>
    </Page>
  );
}

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

export const AddMessageForm = ({
  roomId,
  session,
  onMessagePost,
}: {
  roomId: string;
  session: Session | null;
  onMessagePost: () => void;
}) => {
  const addMessage = trpc.useMutation("message.add");
  const utils = trpc.useContext();
  const [message, setMessage] = useState("");
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);
  const postMessage = async () => {
    const input = { content: message, roomId };
    try {
      await addMessage.mutateAsync(input);
      setMessage("");
      onMessagePost();
    } catch {}
  };

  const userName = session?.user?.name;
  if (!userName) {
    return (
      <div className="flex rounded bg-gray-800 px-3 py-2 text-lg text-gray-200 w-full justify-between">
        <p className="font-bold">
          You have to{" "}
          <button
            className="inline font-bold underline"
            onClick={() => signIn()}
          >
            sign in
          </button>{" "}
          to write.
        </p>
        <button
          onClick={() => signIn()}
          data-testid="signin"
          className="px-4 bg-indigo-500 rounded h-full"
        >
          Sign In
        </button>
      </div>
    );
  }
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @link https://react-hook-form.com/
           */
          await postMessage();
        }}
      >
        <fieldset disabled={addMessage.isLoading} className="min-w-0">
          <div className="flex rounded bg-gray-700 px-3 py-2 text-lg text-gray-200 w-full items-end">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-transparent outline-none flex-1 outline-0"
              rows={message.split(/\r|\n/).length}
              id="content"
              name="content"
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === "Shift") {
                  setEnterToPostMessage(false);
                }
                if (e.key === "Enter" && enterToPostMessage) {
                  postMessage();
                }
                utils.client.mutation("message.isTyping", {
                  typing: true,
                });
              }}
              onKeyUp={(e) => {
                if (e.key === "Shift") {
                  setEnterToPostMessage(true);
                }
              }}
              onBlur={() => {
                setEnterToPostMessage(true);
                utils.client.mutation("message.isTyping", {
                  typing: false,
                });
              }}
            />
            <div>
              <button type="submit" className="px-4 bg-indigo-500 rounded py-1">
                Submit
              </button>
            </div>
          </div>
        </fieldset>
        {addMessage.error && (
          <p style={{ color: "red" }}>{addMessage.error.message}</p>
        )}
      </form>
    </>
  );
};
