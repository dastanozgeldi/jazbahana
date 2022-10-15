import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

const defaultRoomSelect = Prisma.validator<Prisma.RoomSelect>()({
  id: true,
  title: true,
  description: true,
  authorName: true,
  authorImage: true,
  createdAt: true,
  updatedAt: true,
  participants: true,
  authorId: true,
  topicId: true,
  topic: true,
});

export const roomRouter = createRouter()
  .query("infinite", {
    input: z.object({
      limit: z.number().min(1).max(10).nullish(),
      cursor: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 5;
      const { cursor } = input;

      const items = await ctx.prisma.room.findMany({
        select: defaultRoomSelect,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return { items, nextCursor };
    },
  })
  .query("infiniteByTopicId", {
    input: z.object({
      cursor: z.date().nullish(),
      limit: z.number().min(1).max(10).default(5),
      topicId: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { limit, cursor, topicId } = input;
      const items = await ctx.prisma.room.findMany({
        select: defaultRoomSelect,
        orderBy: {
          updatedAt: "desc",
        },
        cursor: cursor ? { updatedAt: cursor } : undefined,
        take: limit + 1,
        where: { topicId },
      });
      // let prevCursor: typeof cursor | undefined = undefined;
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.updatedAt;
      }

      return { items, nextCursor };
    },
  })
  .query("byTopicId", {
    input: z.object({
      topicId: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { topicId } = input;
      const rooms = await ctx.prisma.room.findMany({ where: { topicId } });
      if (!rooms) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No rooms for topic id ${topicId}`,
        });
      }
      return rooms;
    },
  })
  .mutation("add", {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(64),
      description: z.string().min(1).max(128),
      authorName: z.string().optional(),
      authorImage: z.string().optional(),
      authorId: z.string().cuid().optional(),
      topicId: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const room = await ctx.prisma.room.create({
        data: input,
        select: defaultRoomSelect,
      });
      return room;
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const room = await ctx.prisma.room.findUnique({
        where: { id },
        select: defaultRoomSelect,
      });
      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No room with id '${id}'`,
        });
      }
      return room;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        topicId: z.string().uuid(),
        title: z.string().min(1).max(64),
        description: z.string().min(1).max(128),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const room = await ctx.prisma.room.update({
        where: { id },
        data,
        select: defaultRoomSelect,
      });
      return room;
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.participantsInRooms.deleteMany({
        where: { roomId: id },
      });
      await ctx.prisma.room.delete({
        where: { id },
        include: { messages: true, participants: true },
      });
      return { id };
    },
  })
  .query("getCount", {
    async resolve({ ctx }) {
      return await ctx.prisma.room.count();
    },
  });
