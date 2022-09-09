import { z } from "zod";
import { createRouter } from "./context";

export const userRouter = createRouter()
  .query("recentRoom", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const room = await ctx.prisma.room.findFirst({
        where: { authorId: id },
        include: { topic: true },
      });
      return room;
    },
  })
  .query("info", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      return await ctx.prisma.user.findUnique({
        where: { id },
        include: { rooms: true },
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().cuid(),
      data: z.object({
        bio: z.string().max(128),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const user = await ctx.prisma.user.update({
        where: { id },
        data,
      });
      return user;
    },
  });
