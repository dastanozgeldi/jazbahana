import { createRouter } from "./context";

export const schoolRouter = createRouter().query("all", {
  resolve({ ctx }) {
    return ctx.prisma.school.findMany();
  },
});
