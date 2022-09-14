import { z } from "zod";
import { createRouter } from "./context";

export const newsRouter = createRouter()
  .query("all", {
    resolve({ ctx }) {
      return ctx.prisma.news.findMany({ orderBy: { updatedAt: "desc" } });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const news = await ctx.prisma.news.findUnique({ where: { id } });
      return news;
    },
  })
  .mutation("addView", {
    input: z.object({
      id: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const news = await ctx.prisma.news.update({
        data: {
          views: {
            increment: 1,
          },
        },
        where: { id },
      });
      return news;
    },
  });
