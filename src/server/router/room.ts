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
});

export const roomRouter = createRouter()
  .query("infinite", {
    input: z.object({
      cursor: z.date().nullish(),
      limit: z.number().min(1).max(10).default(5),
    }),
    async resolve({ ctx, input }) {
      const { limit, cursor } = input;
      const items: any = await ctx.prisma.room.findMany({
        select: defaultRoomSelect,
        orderBy: {
          updatedAt: "desc",
        },
        cursor: cursor ? { updatedAt: cursor } : undefined,
        take: limit + 1,
      });
      // let prevCursor: typeof cursor | undefined = undefined;
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.updatedAt;
      }

      return {
        items,
        nextCursor,
      };
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
      await ctx.prisma.user.update({
        data: { balance: { decrement: 100 } },
        where: { id: input.authorId },
      });
      const room = await ctx.prisma.room.create({
        data: input,
        select: defaultRoomSelect,
      });
      return room;
    },
  })
  .query("all", {
    resolve({ ctx }) {
      return ctx.prisma.room.findMany({
        select: defaultRoomSelect,
        orderBy: { updatedAt: "desc" },
      });
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
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(64),
        description: z.string().min(1).max(128),
        topicId: z.string().optional(),
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
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.room.delete({ where: { id } });
      return { id };
    },
  });
