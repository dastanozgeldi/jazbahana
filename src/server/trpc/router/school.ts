import { publicProcedure, router } from "../trpc";

export const schoolRouter = router({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.school.findMany()),
});
