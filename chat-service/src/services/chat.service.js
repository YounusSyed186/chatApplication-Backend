const Message = require("../models/message.model");
const Room = require("../models/room.model");

async function saveMessage(data) {
  try {
    console.log('Chat service: saving message', data);
    return await Message.createMessage(data.roomId, data.senderId, data.content);
  } catch (err) {
    console.error('saveMessage error:', err.message);
    throw err;
  }
}

async function getMessages(roomId) {
  try {
    console.log('Chat service: getting messages for room', roomId);
    return await Message.getMessagesByRoom(roomId);
  } catch (err) {
    console.error('getMessages error:', err.message);
    throw err;
  }
}
async function createRoom(data) {
  try {
    console.log('Chat service: creating room', data.name);
    return await Room.createRoom(data.name, data.members);
  } catch (err) {
    console.error('createRoom error:', err.message);
    throw err;
  }
}

module.exports = {
  saveMessage,
  getMessages,
  createRoom
};