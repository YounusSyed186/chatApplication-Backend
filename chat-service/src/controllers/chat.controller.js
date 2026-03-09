const chatService = require("../services/chat.service");

async function getMessages(req, res) {
  try {
    const roomId = req.params.roomId;
    console.log('Get messages request for room:', roomId);
    const messages = await chatService.getMessages(roomId);

    console.log('Retrieved messages for room:', roomId);
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

async function createRoom(req, res) {
  try {
    console.log('Create room request:', req.body);
    const room = await chatService.createRoom(req.body);
    console.log('Room created:', room);
    res.json(room);
  } catch (err) {
    console.error('Create room error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createRoom,
  getMessages
};
