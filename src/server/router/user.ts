import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const userRouter = createRouter().query("rooms", {
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
});
