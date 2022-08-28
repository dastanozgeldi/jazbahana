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
});

export const roomRouter = createRouter()
  .mutation("add", {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(64),
      description: z.string().min(1),
      authorName: z.string().optional(),
      authorImage: z.string().optional(),
      authorId: z.string().cuid().optional(),
    }),
    async resolve({ input }) {
      const room = await prisma?.room.create({
        data: input,
        select: defaultRoomSelect,
      });
      return room;
    },
  })
  .query("all", {
    async resolve() {
      return prisma?.room.findMany({
        select: defaultRoomSelect,
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const room = await prisma?.room.findUnique({
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
  });
