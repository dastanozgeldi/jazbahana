import { Prisma } from "@prisma/client";
import { createRouter } from "./context";

const defaultTopicSelect = Prisma.validator<Prisma.TopicSelect>()({
  id: true,
  name: true,
  image: true,
  createdAt: true,
  rooms: true,
});

export const topicRouter = createRouter().query("all", {
  resolve({ ctx }) {
    return ctx.prisma.topic.findMany({
      select: defaultTopicSelect,
    });
  },
});
