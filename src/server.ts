import { Server as SocketIOServer } from "socket.io";
import http from "http";
import app from "./app";
import config from "./config";

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: config.client.url as string,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  console.log("a user connected");

  socket.on("message", (message: any, roomName: any) => {
    console.log(message?.content, roomName);

    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
