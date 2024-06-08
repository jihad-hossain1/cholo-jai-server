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

// import { Server as HttpServer } from "http";
// import { Server as SocketIOServer, Socket } from "socket.io";
// import app from "./app";
// import config from "./config";
// import { PrismaClient, Message } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const server: HttpServer = app.listen(config.port, () => {
//     console.log(`Server running on port ${config.port}`);
//   });

//   const io = new SocketIOServer(server);

//   io.on("connection", (socket: Socket) => {
//     console.log("A user connected", socket.id);

//     // Handle join room event
//     // socket.on("joinroom", async (roomId: string) => {
//     //   socket.join(roomId);
//     //   console.log(`User joined room: ${roomId}`);
//     // });

//     socket.on("user-message", (message) => {
//       console.log(message);
//       io.emit("message", message);
//     });

//     // Handle leave room event
//     socket.on("leaveRoom", (roomId: string) => {
//       socket.leave(roomId);
//       console.log(`User left room: ${roomId}`);
//     });

//     // Handle send message event
//     socket.on(
//       "sendMessage",
//       async (data: {
//         content: string;
//         chatRoomId: string;
//         senderId: string;
//       }) => {
//         console.log("🚀 ~ socket.on ~ data:", data);
//         const { content, chatRoomId, senderId } = data;

//         try {
//           // Save the message to the database
//           const message: Message = await prisma.message.create({
//             data: {
//               content,
//               chatRoomId,
//               senderId,
//             },
//           });

//           // Emit the message to the chat room
//           io.to(chatRoomId).emit("receiveMessage", message);
//         } catch (error) {
//           console.error("Error saving message to the database:", error);
//           socket.emit("error", "Failed to send message");
//         }
//       }
//     );

//     socket.on("disconnect", () => {
//       console.log("User disconnected", socket.id);
//     });
//   });

//   return server;
// }

// main().catch((error) => {
//   console.error("Error starting the server:", error);
//   prisma.$disconnect();
// });

// import { Server } from "http";
// import app from "./app";
// import config from "./config";

// async function main() {
//   const server: Server = app.listen(config.port, () => {
//     console.log(`Cholo jai server running on port ${config.port}`);
//   });

//   return server;
// }

// main();
