import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1648023",
  key: "be59e05099343ab658a2",
  secret: "ac4984ecc551348ffae5",
  cluster: "ap2",
  useTLS: true,
});

export const pusherClient = new PusherClient("be59e05099343ab658a2", {
  cluster: "ap2",
});
