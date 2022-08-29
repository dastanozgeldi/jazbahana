import { Prisma } from "@prisma/client";
import { createRouter } from "./context";

const defaultTopicSelect = Prisma.validator<Prisma.TopicsInRoomsSelect>()({
  name: true,
  image: true,
  topicId: true,
  roomId: true,
  assignedAt: true,
  assignedBy: true,
});

export const topicRouter = createRouter().query("all", {
  async resolve() {
    return prisma?.topicsInRooms.findMany({
      select: defaultTopicSelect,
    });
  },
});
