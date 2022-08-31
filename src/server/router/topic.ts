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
    resolve({ ctx }) {
      return ctx.prisma.topic.findMany({
        select: defaultTopicSelect,
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
