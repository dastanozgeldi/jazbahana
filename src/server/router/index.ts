// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { roomRouter } from "./room";
import { topicRouter } from "./topic";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("room.", roomRouter)
  .merge("topic.", topicRouter)
  .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
