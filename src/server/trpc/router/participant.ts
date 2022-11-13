import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const participantRouter = router({
  all: publicProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { roomId } = input;
      return await ctx.prisma.participantsInRooms.findMany({
        where: { roomId },
        include: { room: true, user: true },
      });
    }),
  join: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        roomId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, roomId } = input;
      const room = await ctx.prisma.participantsInRooms.create({
        data: { userId, roomId },
      });
      return room;
    }),
  hasJoined: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        roomId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, roomId } = input;
      const user = await ctx.prisma.participantsInRooms.findUnique({
        where: { roomId_userId: { roomId, userId } },
      });
      return user ? true : false;
    }),
});
