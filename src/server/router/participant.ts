import { z } from "zod";
import { createRouter } from "./context";

export const participantRouter = createRouter()
  .query("all", {
    input: z.object({
      roomId: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { roomId } = input;
      return await ctx.prisma.participantsInRooms.findMany({
        where: { roomId },
        include: { room: true, user: true },
      });
    },
  })
  .mutation("join", {
    input: z.object({
      userId: z.string().cuid(),
      roomId: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { userId, roomId } = input;
      const room = await ctx.prisma.participantsInRooms.create({
        data: { userId, roomId },
      });
      return room;
    },
  })
  .query("hasJoined", {
    input: z.object({
      userId: z.string().cuid(),
      roomId: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { userId, roomId } = input;
      const user = await ctx.prisma.participantsInRooms.findUnique({
        where: { roomId_userId: { roomId, userId } },
      });
      return user ? true : false;
    },
  });
