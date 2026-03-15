const db = require('../config/db');

async function getRelevantMessages(roomId, embedding, limit = 5) {

  // Convert embedding array to pgvector format
  const vector = `[${embedding.join(",")}]`;

  const result = await db.query(
    `SELECT content, sender_id, created_at
     FROM messages
     WHERE room_id = $1
     ORDER BY embedding <-> $2::vector
     LIMIT $3`,
    [roomId, vector, limit]
  );

  return result.rows;
}

module.exports = {
  getRelevantMessages
};