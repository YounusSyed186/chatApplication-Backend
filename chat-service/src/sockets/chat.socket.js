const db = require("../config/db");
const chatService = require("../services/chat.service");

function setupChatSocket(io) {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    console.log("User connected:", socket.id, "UserId:", userId);

    if (userId) {
      await db.query(
        "UPDATE users SET is_online = true WHERE id = $1",
        [userId]
      );

      console.log(`User ${userId} is now ONLINE`);
    }

    socket.on("joinRoom", (roomId) => {
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      socket.join(roomId);
    });

    socket.on("sendMessage", async (data) => {
      console.log("New message:", data);

      const message = await chatService.saveMessage(data);

      io.to(data.roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", userId);

      if (userId) {
        await db.query(
          "UPDATE users SET is_online = false WHERE id = $1",
          [userId]
        );

        console.log(`User ${userId} is now OFFLINE`);
      }
    });
  });
}

module.exports = setupChatSocket;