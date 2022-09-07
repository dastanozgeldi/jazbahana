import type { Room as RoomType, Topic } from "@prisma/client";
import type { Session } from "next-auth";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ACTION_BUTTON,
  CARD,
  INPUT_SELECT,
  INPUT_TEXT,
  LABEL,
  TOPIC,
} from "../styles";
import { trpc } from "../utils/trpc";
import { IoAdd, IoPeople } from "react-icons/io5";
import Avatar from "./Avatar";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

type RoomSectionProps = {
  session: Session | null;
  profilePage?: boolean;
};

type AddRoomProps = {
  adding: boolean;
  profilePage: boolean;
  session: Session;
  topicsQuery: any;
};

type RoomProps = { data: RoomType; topicsQuery: any };

export default function RoomsSection({
  session,
  profilePage = false,
}: RoomSectionProps) {
  const [adding, setAdding] = useState(false);
  const topicsQuery = trpc.useQuery(["topic.all"]);
  const { push, query } = useRouter();
  const page = query.page ? Number(query.page) - 1 : 0;

  const { data } = trpc.useInfiniteQuery(["room.infinite", { limit: 10 }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: () => page - 1,
  });
  const rooms = data?.pages[page]?.items;

  const messagesQuery = trpc.useInfiniteQuery(["message.infinite", {}], {
    getPreviousPageParam: (d) => d.prevCursor,
  });
  const utils = trpc.useContext();
  const { hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage } =
    messagesQuery;

  const [messages, setMessages] = useState(() => {
    const msgs = messagesQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type Message = NonNullable<typeof messages>[number];
  const userName = session?.user?.name;
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

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <span className="text-gray-400">{rooms?.length} available</span>
        </div>

        {session && (
          <>
            <button
              className={`${ACTION_BUTTON} flex items-center gap-2`}
              onClick={() => setAdding(!adding)}
            >
              <IoAdd className="w-6 h-6" /> Add Room
            </button>
          </>
        )}
      </div>
      {session && (
        <AddRoom
          topicsQuery={topicsQuery}
          adding={adding}
          profilePage={profilePage}
          session={session}
        />
      )}

      {/* Messages */}
      <div className="md:h-screen flex-1 overflow-y-hidden">
        <section className="bg-gray-700 h-full p-4 flex flex-col justify-end space-y-4">
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
                    <img
                      className="w-6 h-6 rounded-full"
                      src={
                        item.authorImage ||
                        "https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png"
                      }
                      alt="user avatar"
                    />
                    <h3 className="text-md">
                      <Link href={`/${item.authorId || "ghost"}`}>
                        <a>{item.authorName}</a>
                      </Link>
                    </h3>
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

      {rooms?.map((room: RoomType) => (
        <Room key={room.id} topicsQuery={topicsQuery} data={room} />
      ))}
      {/* Pagination */}
      {data?.pages && data?.pages.length > 0 && (
        <div className="flex justify-between">
          <button className={ACTION_BUTTON}>previous page</button>
          <button className={ACTION_BUTTON}>next page</button>
        </div>
      )}
    </div>
  );
}

type FormData = {
  title: string;
  description: string;
  topic: object;
};

export const AddMessageForm = ({
  session,
  onMessagePost,
}: {
  session: Session | null;
  onMessagePost: () => void;
}) => {
  const addMessage = trpc.useMutation("message.add");
  const utils = trpc.useContext();
  const [message, setMessage] = useState("");
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);
  const postMessage = async () => {
    const input = { content: message };
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
          <div className="flex rounded bg-gray-500 px-3 py-2 text-lg text-gray-200 w-full items-end">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-transparent flex-1 outline-0"
              rows={message.split(/\r|\n/).length}
              id="text"
              name="text"
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

export const AddRoom = ({
  adding,
  profilePage,
  session,
  topicsQuery,
}: AddRoomProps) => {
  const { data } = topicsQuery;
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [topicId, setTopicId] = useState<string>("");
  const utils = trpc.useContext();
  const addRoom = trpc.useMutation("room.add", {
    async onSuccess() {
      // refetches all rooms after successful add
      if (profilePage) {
        await utils.invalidateQueries(["user.rooms"]);
      } else {
        await utils.invalidateQueries(["room.all"]);
      }
      reset();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addRoom.mutateAsync({
        ...data,
        authorName: session.user?.name || "unknown",
        authorImage: session.user?.image || "/default-avatar.png",
        authorId: session.user?.id || "",
        topicId,
      });
    } catch {}
  });

  return (
    <div className={`flex items-center justify-center my-4 ${CARD}`}>
      <form hidden={!adding} className="w-[90%] mx-auto" onSubmit={onSubmit}>
        <h2 className="text-center text-3xl font-bold mb-2">Add Room</h2>
        {/* Title */}
        <div>
          <label className={LABEL} htmlFor="title">
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
          <label className={LABEL} htmlFor="description">
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
          <label className={LABEL} htmlFor="topic">
            Topic:
          </label>
          <select
            {...register("topic")}
            id="topic"
            className={INPUT_SELECT}
            onChange={(e) => setTopicId(e.currentTarget.value)}
          >
            <option selected>Choose a topic</option>
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
          Submit
        </button>
        {/* Validation Error */}
        {addRoom.error && (
          <p className="text-red-500">{addRoom.error.message}</p>
        )}
      </form>
    </div>
  );
};

export const Room = ({ data, topicsQuery }: RoomProps) => {
  const { data: topics } = topicsQuery;
  const topic = topics.find((t: Topic) => t.id === data.topicId);

  return (
    <article
      className="my-2 flex gap-2 flex-col text-[#202020] bg-neutral-100 dark:text-neutral-100 dark:bg-[#202020] p-4 rounded-xl"
      key={data.id}
    >
      <div className="flex items-center justify-between">
        <Link href={`/users/${data.authorId || "ghost"}`}>
          <a className="flex items-center gap-2 font-medium">
            <Avatar src={data.authorImage} size={32} />
            <span>{data.authorName || "ghost"}</span>
          </a>
        </Link>
        <p className="text-gray-500">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
      </div>
      <Link href={`/rooms/${data.id}`}>
        <a className="max-w-max text-2xl font-semibold">{data.title}</a>
      </Link>
      <p className="text-gray-400">{data.description}</p>
      <div className="my-2 flex justify-between">
        <span className={`${TOPIC} flex items-center gap-2`}>
          <IoPeople className="w-5 h-5" /> 0 participants
        </span>
        {topic && (
          <span
            className={`${TOPIC} flex items-center gap-2`}
            key={data.topicId}
          >
            {topic.image && <img src={topic.image} className="w-4 h-4" />}
            {topic.name}
          </span>
        )}
      </div>
    </article>
  );
};
