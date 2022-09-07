import { Message } from "@prisma/client";
import { Subscription, TRPCError } from "@trpc/server";
import { EventEmitter } from "events";
import { z } from "zod";
import { createRouter, Context } from "./context";

interface MyEvents {
  add: (data: Message) => void;
  isTypingUpdate: () => void;
}

declare interface MyEventEmitter {
  on<U extends keyof MyEvents>(event: U, listener: MyEvents[U]): this;
  once<U extends keyof MyEvents>(event: U, listener: MyEvents[U]): this;
  emit<U extends keyof MyEvents>(
    event: U,
    ...args: Parameters<MyEvents[U]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

const ee = new MyEventEmitter();

const currentlyTyping: Record<string, { lastTyped: Date }> =
  Object.create(null);

// every 1s, clear old "isTyping"
const interval = setInterval(() => {
  let updated = false;
  const now = Date.now();
  for (const [key, value] of Object.entries(currentlyTyping)) {
    if (now - value.lastTyped.getTime() > 3e3) {
      delete currentlyTyping[key];
      updated = true;
    }
  }
  if (updated) {
    ee.emit("isTypingUpdate");
  }
}, 3e3);
process.on("SIGTERM", () => clearInterval(interval));

const getAuthorOrThrow = (ctx: Context) => {
  const id = ctx.session?.user?.id;
  const name = ctx.session?.user?.name;
  const image = ctx.session?.user?.image;
  if (!name) throw new TRPCError({ code: "FORBIDDEN" });
  return { id, name, image };
};

export const messageRouter = createRouter()
  .mutation("add", {
    input: z.object({
      id: z.string().uuid().optional(),
      roomId: z.string().uuid(),
      content: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      const author = getAuthorOrThrow(ctx);
      const message = await ctx.prisma.message.create({
        data: {
          ...input,
          authorId: author?.id,
          authorImage: author?.image,
          authorName: author?.name,
        },
      });
      ee.emit("add", message);
      delete currentlyTyping[author.name];
      ee.emit("isTypingUpdate");
      return message;
    },
  })
  .mutation("isTyping", {
    input: z.object({
      typing: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const author = getAuthorOrThrow(ctx);
      if (!input.typing) {
        delete currentlyTyping[author.name];
      } else {
        currentlyTyping[author.name] = {
          lastTyped: new Date(),
        };
      }
      ee.emit("isTypingUpdate");
    },
  })
  .query("infinite", {
    input: z.object({
      roomId: z.string().uuid(),
      cursor: z.date().nullish(),
      take: z.number().min(1).max(50).nullish(),
    }),
    async resolve({ ctx, input }) {
      const take = input.take ?? 10;
      const cursor = input.cursor;
      // `roomId` is of type `string`
      // `cursor` is of type `Date | undefined`
      // `take` is of type `number | undefined`
      const page = await ctx.prisma.message.findMany({
        where: { roomId: input.roomId },
        orderBy: { createdAt: "desc" },
        cursor: cursor
          ? {
              createdAt: cursor,
            }
          : undefined,
        take: take + 1,
        skip: 0,
      });

      const items = page.reverse();
      let prevCursor: null | typeof cursor = null;
      if (items.length > take) {
        const prev = items.shift();
        prevCursor = prev!.createdAt;
      }
      return { items, prevCursor };
    },
  })
  .subscription("onAdd", {
    resolve() {
      return new Subscription<Message>((emit) => {
        const onAdd = (data: Message) => emit.data(data);
        ee.on("add", onAdd);
        return () => ee.off("add", onAdd);
      });
    },
  })
  .subscription("whoIsTyping", {
    resolve() {
      let prev: string[] | null = null;
      return new Subscription<string[]>((emit) => {
        const onIsTypingUpdate = () => {
          const newData = Object.keys(currentlyTyping);

          if (!prev || prev.toString() !== newData.toString()) {
            emit.data(newData);
          }
          prev = newData;
        };
        ee.on("isTypingUpdate", onIsTypingUpdate);
        return () => ee.off("isTypingUpdate", onIsTypingUpdate);
      });
    },
  });
