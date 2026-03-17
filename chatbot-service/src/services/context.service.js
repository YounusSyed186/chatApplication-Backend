const db = require('../config/db');

async function getUserContext(userId) {
  const result = await db.query(`
    SELECT username, bio, interests, college
    FROM users WHERE id = $1
  `, [userId]);

  return result.rows[0];
}

async function getFriends(userId) {
  const result = await db.query(`
    SELECT u.username
    FROM friends f
    JOIN users u ON u.id = f.friend_id
    WHERE f.user_id = $1
    LIMIT 5
  `, [userId]);

  return result.rows;
}

async function getRelevantEvents(embedding) {
  const vector = `[${embedding.join(",")}]`;

  const result = await db.query(`
    SELECT title, description, location
    FROM events
    WHERE embedding IS NOT NULL
    ORDER BY embedding <-> $1::vector
    LIMIT 3
  `, [vector]);

  return result.rows;
}

module.exports = {
  getUserContext,
  getFriends,
  getRelevantEvents
};

