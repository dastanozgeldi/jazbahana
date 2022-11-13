import { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultTopicSelect = Prisma.validator<Prisma.TopicSelect>()({
  id: true,
  name: true,
  image: true,
  createdAt: true,
  rooms: true,
});

export const topicRouter = router({
  all: publicProcedure.query(async ({ ctx }) =>
    ctx.prisma.topic.findMany({
      select: defaultTopicSelect,
      orderBy: { rooms: { _count: "desc" } },
    })
  ),
  getSome: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10) }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      return ctx.prisma.topic.findMany({
        select: defaultTopicSelect,
        take: limit - 1,
        orderBy: { rooms: { _count: "desc" } },
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const topic = await ctx.prisma.topic.findUnique({ where: { id } });
      return topic;
    }),
});
