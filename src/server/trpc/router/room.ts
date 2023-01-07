import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultRoomSelect = Prisma.validator<Prisma.RoomSelect>()({
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  participants: true,
  userId: true,
  user: true,
  topicId: true,
  topic: true,
  isPinned: true,
});

export const roomRouter = router({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
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
    }),
  infiniteByTopicId: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(10).default(5),
        topicId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, topicId } = input;
      const items = await ctx.prisma.room.findMany({
        select: defaultRoomSelect,
        where: {
          topicId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        orderBy: {
          updatedAt: "desc",
        },
      });
      // let prevCursor: typeof cursor | undefined = undefined;
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),
  topicId: publicProcedure
    .input(
      z.object({
        topicId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { topicId } = input;
      const rooms = await ctx.prisma.room.findMany({ where: { topicId } });
      if (!rooms) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No rooms for topic id ${topicId}`,
        });
      }
      return rooms;
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(64),
        description: z.string().min(1).max(128),
        userId: z.string().cuid().optional(),
        topicId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.create({
        data: input,
        select: defaultRoomSelect,
      });
      return room;
    }),
  pin: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        isPinned: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomId, isPinned } = input;
      const pinnedRoom = await ctx.prisma.pinnedRoom.create({
        data: {
          roomId,
          userId: ctx.session?.user?.id || "",
        },
      });
      await ctx.prisma.room.update({
        where: { id: roomId },
        data: { isPinned: !isPinned },
      });
      return pinnedRoom;
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          topicId: z.string().uuid(),
          title: z.string().min(1).max(64),
          description: z.string().min(1).max(128),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const room = await ctx.prisma.room.update({
        where: { id },
        data,
        select: defaultRoomSelect,
      });
      return room;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.pinnedRoom.deleteMany({
        where: { roomId: id },
      });
      await ctx.prisma.participantsInRooms.deleteMany({
        where: { roomId: id },
      });
      await ctx.prisma.room.delete({
        where: { id },
      });
      return { id };
    }),
  getCount: publicProcedure.query(
    async ({ ctx }) => await ctx.prisma.room.count()
  ),
  pinnedRooms: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return await ctx.prisma.room.findMany({
        where: { userId },
        include: { participants: true },
      });
    }),
});
