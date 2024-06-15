"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
  cors: {
    origin: config_1.default.client.url,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (message, roomName) => {
    console.log(
      message === null || message === void 0 ? void 0 : message.content,
      roomName
    );
    io.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
server.listen(config_1.default.port, () => {
  console.log(`Server running on port ${config_1.default.port}`);
});
