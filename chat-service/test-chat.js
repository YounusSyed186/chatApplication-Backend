const { io } = require("socket.io-client");

const socket = io("http://localhost:4002");

const roomId = "69ac5f69feb7c9f088163f62";

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("joinRoom", roomId);

  socket.emit("sendMessage", {
    roomId: roomId,
    senderId: "user1",
    content: "Hello ML group!"
  });
});

socket.on("receiveMessage", (msg) => {
  console.log("Message received:", msg);
});