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
  authorId: true,
  topics: true,
});

export const roomRouter = createRouter()
  .mutation("add", {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(64),
      description: z.string().min(1).max(128),
      authorName: z.string().optional(),
      authorImage: z.string().optional(),
      authorId: z.string().cuid().optional(),
      topics: z.array(
        z.object({
          name: z.string(),
          image: z.string(),
          topicId: z.string(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      const { topics } = input;
      const room = await ctx.prisma.room.create({
        data: { ...input, topics: { create: topics } },
        select: defaultRoomSelect,
      });
      return room;
    },
  })
  .query("all", {
    async resolve() {
      return prisma?.room.findMany({
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
          message: `No post with id '${id}'`,
        });
      }
      return room;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
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
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.room.delete({ where: { id } });
      return { id };
    },
  });
