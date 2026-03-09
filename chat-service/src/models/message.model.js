const db = require("../config/db");

async function createMessage(roomId, senderId, content) {
  const result = await db.query(
    "INSERT INTO messages (room_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *",
    [roomId, senderId, content]
  );
  return result.rows[0];
}

async function getMessagesByRoom(roomId) {
  const result = await db.query(
    "SELECT * FROM messages WHERE room_id = $1 ORDER BY created_at ASC",
    [roomId]
  );
  return result.rows;
}

module.exports = {
  createMessage,
  getMessagesByRoom
};