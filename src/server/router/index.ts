// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { roomRouter } from "./room";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("room.", roomRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
