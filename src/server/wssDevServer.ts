import { createContext } from "./router/context";
import { appRouter } from "./router";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import fetch from "node-fetch";
import ws from "ws";

if (!global.fetch) {
  (global as any).fetch = fetch;
}

const wss = new ws.Server({
  port: 3001,
});
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", (ws) => {
  console.log(`++ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`-- Connection (${wss.clients.size})`);
  });
});
console.log("✅ Websocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
