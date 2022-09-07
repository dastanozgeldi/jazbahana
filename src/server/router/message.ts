import { z } from "zod";
import { createRouter } from "./context";

export const messageRouter = createRouter().mutation("add", {
  input: z.object({
    id: z.string().uuid().optional(),
    content: z.string().min(1),
  }),
  async resolve({ ctx, input }) {
    const author = ctx.session?.user;
    const message = await ctx.prisma.message.create({
      data: {
        ...input,
        authorId: author?.id,
        authorImage: author?.image,
        authorName: author?.name,
      },
    });
  },
});
