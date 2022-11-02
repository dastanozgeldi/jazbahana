// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { roomRouter } from "./room";
import { topicRouter } from "./topic";
import { userRouter } from "./user";
import { messageRouter } from "./message";
import { newsRouter } from "./news";
import { participantRouter } from "./participant";
import { schoolRouter } from "./school";
import { hometaskRouter } from "./hometask";
import { noteRouter } from "./note";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("room.", roomRouter)
  .merge("topic.", topicRouter)
  .merge("user.", userRouter)
  .merge("message.", messageRouter)
  .merge("news.", newsRouter)
  .merge("participant.", participantRouter)
  .merge("school.", schoolRouter)
  .merge("hometask.", hometaskRouter)
  .merge("note.", noteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
