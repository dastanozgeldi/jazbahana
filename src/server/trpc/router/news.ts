import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const newsRouter = router({
  all: publicProcedure.query(({ ctx, input }) =>
    ctx.prisma.news.findMany({ orderBy: { updatedAt: "desc" } })
  ),
  getSome: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      return ctx.prisma.news.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const news = await ctx.prisma.news.findUnique({ where: { id } });
      return news;
    }),
  addView: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
    }),
});
