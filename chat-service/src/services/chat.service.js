const Message = require("../models/message.model");
const Room = require("../models/room.model");

async function saveMessage(data) {
  try {
    if (!data.id || !data.roomId || !data.sender_id || !data.content) {
      throw new Error("Invalid message data");
    }

    const message = await Message.createMessage(
      data.id,
      data.roomId,
      data.sender_id,
      data.content
    );

    return message;
  } catch (err) {
    console.error("saveMessage error:", err.message);
    throw new Error("Unable to save message.");
  }
}

async function getMessages(roomId) {
  try {
    if (!roomId) throw new Error("Room ID is required");
    return await Message.getMessagesByRoom(roomId);
  } catch (err) {
    console.error("getMessages error:", err.message);
    throw new Error("Unable to fetch messages.");
  }
}

async function createRoom(data) {
  try {
    if (!data.name || !Array.isArray(data.members)) {
      throw new Error("Invalid room data");
    }
    return await Room.createRoom(data.name, data.members);
  } catch (err) {
    console.error("createRoom error:", err.message);
    throw new Error("Unable to create room.");
  }
}

async function getRooms(userId) {
  try {
    if (!userId) throw new Error("User ID is required");
    return await Room.getRoomsForUser(userId);
  } catch (err) {
    console.error("getRooms error:", err.message);
    throw new Error("Unable to fetch rooms.");
  }
}

module.exports = {
  saveMessage,
  getMessages,
  createRoom,
  getRooms
};