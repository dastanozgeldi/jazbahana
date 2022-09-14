import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  balance: true,
  bio: true,
  school: true,
  schoolId: true,
  grade: true,
  rooms: true,
  Room: true,
  mates: true,
  messages: true,
});

export const userRouter = createRouter()
  .query("recentRoom", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const room = await ctx.prisma.room.findFirst({ where: { authorId: id } });
      return room;
    },
  })
  .query("info", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      return await ctx.prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });
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
        select: defaultUserSelect,
        data,
      });
      return user;
    },
  })
  .query("peopleFromSchool", {
    input: z.object({
      id: z.string().cuid(),
      schoolId: z.string().uuid(),
    }),
    async resolve({ ctx, input }) {
      const { id, schoolId } = input;
      const students = await ctx.prisma.user.findMany({
        where: { id: { not: id }, schoolId },
        select: defaultUserSelect,
      });
      return students;
    },
  });
