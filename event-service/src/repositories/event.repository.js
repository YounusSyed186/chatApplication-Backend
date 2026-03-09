const db = require("../config/db");

async function createEvent(userId, college, message) {
  try {
    const query = `
      INSERT INTO events (id, user_id, college, title, description)
      VALUES (gen_random_uuid(), $1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await db.query(query, [
      userId,
      college,
      message.title,
      message.description,
    ]);

    return result.rows[0];
  } catch (err) {
    console.error("Event repository createEvent error:", err.message);
    throw err;
  }
}

async function getTopEvents(college) {
  try {

    let query;
    let params = [];

    if (college) {
      query = `
        SELECT 
          events.id,
          events.title,
          events.description,
          events.likes,
          events.demand_count,
          events.created_at,
          events.college,
          users.username
        FROM events
        LEFT JOIN users 
          ON users.id = events.user_id
        WHERE events.college = $1
        ORDER BY (events.likes * 2 + events.demand_count * 3) DESC
        LIMIT 10;
      `;

      params = [college];
    } else {

      query = `
        SELECT 
          events.id,
          events.title,
          events.description,
          events.likes,
          events.demand_count,
          events.created_at,
          events.college,
          users.username
        FROM events
        LEFT JOIN users 
          ON users.id = events.user_id
        ORDER BY (events.likes * 2 + events.demand_count * 3) DESC
        LIMIT 20;
      `;
    }

    const result = await db.query(query, params);

    return result.rows;

  } catch (err) {
    console.error("Event repository getTopEvents error:", err.message);
    throw err;
  }
}

module.exports = {
  createEvent,
  getTopEvents,
};