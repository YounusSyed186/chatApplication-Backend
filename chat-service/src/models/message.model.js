const db = require("../config/db");

async function createMessage(id, roomId, senderId, content, embedding) {
  const result = await db.query(
    `INSERT INTO messages (id, room_id, sender_id, content, embedding)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, roomId, senderId, content, embedding]
  );

  return result.rows[0];
}

async function getMessagesByRoom(roomId) {
  const result = await db.query(
    `SELECT * FROM messages
     WHERE room_id = $1
     ORDER BY created_at ASC`,
    [roomId]
  );

  return result.rows;
}

module.exports = {
  createMessage,
  getMessagesByRoom
};