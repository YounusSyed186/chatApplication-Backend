const chatService = require("../services/chat.service");

async function getMessages(req, res) {
  try {
    const roomId = req.params.roomId;
    const messages = await chatService.getMessages(roomId);
    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function createRoom(req, res) {
  try {
    const room = await chatService.createRoom(req.body);
    res.json(room);
  } catch (err) {
    console.error("Create room error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getRooms(req, res) {
  try {
    const userId = req.params.userId;
    const rooms = await chatService.getRooms(userId);
    res.json(rooms);
  } catch (err) {
    console.error("Get rooms error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createRoom,
  getMessages,
  getRooms
};