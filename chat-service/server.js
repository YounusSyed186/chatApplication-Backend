require("dotenv").config();

const http = require("http");
const app = require("./src/app");

const { Server } = require("socket.io");

async function startServer() {

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: "*" }
  });

  const setupChatSocket = require("./src/sockets/chat.socket");
  setupChatSocket(io);

  const PORT = process.env.PORT || 5002;

  server.listen(PORT, () => {
    console.log(`Chat service running on ${PORT}`);
  });
}

startServer();