import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const userRouter = createRouter()
  .query("rooms", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const rooms = await ctx.prisma.room.findMany({
        where: { authorId: id },
        orderBy: { updatedAt: "desc" },
      });
      if (!rooms) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User has no posts",
        });
      }
      return rooms;
    },
  })
  .query("info", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      return await ctx.prisma.user.findUnique({ where: { id } });
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
