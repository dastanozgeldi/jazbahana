import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

const defaultHometaskSelect = Prisma.validator<Prisma.HometaskSelect>()({
  id: true,
  title: true,
  content: true,
  topic: true,
  user: true,
  due: true,
  createdAt: true,
});

export const hometaskRouter = createRouter()
  .mutation("add", {
    input: z.object({
      id: z.string().uuid().optional(),
      topicId: z.string().uuid(),
      userId: z.string().cuid(),
      title: z.string(),
      due: z.date().optional(),
      content: z.string().optional(),
      finished: z.boolean().optional(),
    }),
    async resolve({ ctx, input }) {
      const hometask = await ctx.prisma.hometask.create({
        data: input,
        select: defaultHometaskSelect,
      });
      return hometask;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        topicId: z.string().uuid(),
        title: z.string().min(1).max(64),
        content: z.string().optional(),
        finished: z.boolean().optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const hometask = await ctx.prisma.hometask.update({
        where: { id },
        data,
        select: defaultHometaskSelect,
      });
      return hometask;
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.hometask.delete({ where: { id } });
      return { id };
    },
  })
  .query("all", {
    resolve({ ctx }) {
      return ctx.prisma.hometask.findMany({
        orderBy: { createdAt: "desc" },
        select: defaultHometaskSelect,
        where: { userId: ctx.session?.user?.id },
      });
    },
  })
  .query("byId", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const hometask = await ctx.prisma.hometask.findUnique({
        where: { id },
        select: defaultHometaskSelect,
      });
      if (!hometask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No hometask with id '${id}'`,
        });
      }
      return hometask;
    },
  });
