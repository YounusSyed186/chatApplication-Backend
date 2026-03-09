const db = require("../config/db");

async function create(college, message) {
  try {
    const query = `
    INSERT INTO confessions (id, college, message)
    VALUES (gen_random_uuid(), $1, $2)
    RETURNING *;
  `;
    const result = await db.query(query, [college, message]);
    return result.rows[0];
  } catch (err) {
    console.error('Confession repository create error:', err.message);
    throw err;
  }
}

async function getByCollege(college) {
  try {
    const query = `
    SELECT * FROM confessions
    WHERE college = $1
    ORDER BY created_at DESC
    LIMIT 50;
  `;
    const result = await db.query(query, [college]);
    return result.rows;
  } catch (err) {
    console.error('Confession repository getByCollege error:', err.message);
    throw err;
  }
}

module.exports = { create, getByCollege };