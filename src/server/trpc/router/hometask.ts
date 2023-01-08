import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const defaultHometaskSelect = Prisma.validator<Prisma.HometaskSelect>()({
  id: true,
  title: true,
  content: true,
  topic: true,
  topicId: true,
  due: true,
  createdAt: true,
  user: true,
  userId: true,
  finished: true,
});

export const hometaskRouter = router({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 5;
      const { cursor } = input;

      const items = await ctx.prisma.hometask.findMany({
        select: defaultHometaskSelect,
        where: {
          userId: ctx.session?.user?.id,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return { items, nextCursor };
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        topicId: z.string().uuid(),
        userId: z.string().cuid(),
        title: z.string(),
        due: z.date().optional(),
        content: z.string().optional(),
        finished: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hometask = await ctx.prisma.hometask.create({
        data: input,
        select: defaultHometaskSelect,
      });
      return hometask;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          topicId: z.string().uuid(),
          title: z.string().min(1).max(64),
          content: z.string().optional(),
          finished: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const hometask = await ctx.prisma.hometask.update({
        where: { id },
        data,
        select: defaultHometaskSelect,
      });
      return hometask;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.hometask.delete({ where: { id } });
      return { id };
    }),
  all: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return ctx.prisma.hometask.findMany({
        orderBy: { createdAt: "desc" },
        select: defaultHometaskSelect,
        where: { userId },
      });
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
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
    }),
  finish: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.hometask.update({
        where: { id },
        data: { finished: true },
      });
    }),
});
