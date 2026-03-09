const chatService = require("../services/chat.service");

function setupChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", async (data) => {
      const message = await chatService.saveMessage(data);

      io.to(data.roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = setupChatSocket;