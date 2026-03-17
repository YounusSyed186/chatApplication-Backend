const db = require('../config/db');

async function getRelevantMessages(roomId, embedding, limit = 5) {
  const vector = `[${embedding.join(",")}]`;

  const result = await db.query(`
    SELECT content, sender_id, created_at
    FROM messages
    WHERE room_id = $1
    ORDER BY embedding <-> $2::vector
    LIMIT $3
  `, [roomId, vector, limit]);
  console.log("roomId in model:", roomId);  

  return result.rows;
}

async function getRoomHistory(roomId, limit = 50) {
  const result = await db.query(`
    SELECT content, sender_id, created_at
    FROM messages
    WHERE room_id = $1
    ORDER BY created_at DESC
    LIMIT $2
  `, [roomId, limit]);

  return result.rows.reverse();
}

module.exports = { getRelevantMessages, getRoomHistory };