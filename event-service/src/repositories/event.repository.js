const db = require("../config/db");

async function createEvent(college, message) {
  try {
    const query = `
    INSERT INTO events (id, college, title, description)
    VALUES (gen_random_uuid(), $1, $2, $3)
    RETURNING *;
  `;
    const result = await db.query(query, [college, message.title, message.description]);
    return result.rows[0];
  } catch (err) {
    console.error('Event repository createEvent error:', err.message);
    throw err;
  }
}

async function getTopEvents(college) {
  try {
    const query = `
    SELECT * FROM events
    WHERE college = $1
    ORDER BY (likes * 2 + demand_count * 3) DESC
    LIMIT 5;
  `;
    const result = await db.query(query, [college]);
    return result.rows;
  } catch (err) {
    console.error('Event repository getTopEvents error:', err.message);
    throw err;
  }
}

module.exports = { createEvent, getTopEvents };