import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

const defaultTopicSelect = Prisma.validator<Prisma.TopicSelect>()({
  id: true,
  name: true,
  image: true,
  createdAt: true,
  rooms: true,
});

export const topicRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return ctx.prisma.topic.findMany({ select: defaultTopicSelect });
    },
  })
  .query("getSome", {
    input: z.object({
      limit: z.number().min(1).max(10),
    }),
    async resolve({ ctx, input }) {
      const { limit } = input;
      return ctx.prisma.topic.findMany({
        select: defaultTopicSelect,
        take: limit - 1,
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const topic = await ctx.prisma.topic.findUnique({ where: { id } });
      return topic;
    },
  });
