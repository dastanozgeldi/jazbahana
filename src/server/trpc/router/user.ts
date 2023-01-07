import { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  username: true,
  email: true,
  emailVerified: true,
  image: true,
  bio: true,
  school: true,
  schoolId: true,
  grade: true,
  rooms: true,
  Room: true,
  pinnedRooms: true,
});

export const userRouter = router({
  info: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().optional(),
        username: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, username } = input;
      const where = username ? { username } : { id };
      return await ctx.prisma.user.findUnique({
        where,
        select: defaultUserSelect,
      });
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: z.object({
          username: z.string().nullish(),
          schoolId: z.string().uuid().nullish(),
          bio: z.string().max(128).nullish(),
          grade: z.string().min(2).max(3).nullish(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const user = await ctx.prisma.user.update({
        where: { id },
        select: defaultUserSelect,
        data,
      });
      return user;
    }),
  connections: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        schoolId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, schoolId } = input;
      return await ctx.prisma.user.findMany({
        where: {
          id: { not: id },
          schoolId,
        },
        select: defaultUserSelect,
      });
    }),
  pinnedRooms: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pinnedRoom.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      include: {
        room: true,
        user: true,
      },
    });
  }),
});
