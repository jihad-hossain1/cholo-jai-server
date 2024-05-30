import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const server: HttpServer = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    // socket.on("setup", (userData) => {
    //   socket.join(userData.id);
    //   console.log(userData._id);
    //   socket.emit("connected");
    // });

    console.log("connected log");

    // Handle join room event
    socket.on("joinroom", async (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Handle leave room event
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
    });

    // Handle send message event
    socket.on("sendMessage", async (data) => {
      console.log("🚀 ~ socket.on ~ data:", data);
      const { content, chatRoomId, senderId } = data;

      // Save the message to the database
      const message = await prisma.message.create({
        data: {
          content,
          chatRoomId,
          senderId,
        },
      });

      // Emit the message to the chat room
      io.to(chatRoomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return server;
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

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
