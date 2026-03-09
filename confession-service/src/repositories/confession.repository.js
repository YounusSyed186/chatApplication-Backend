const db = require("../config/db");

async function create(college, message) {
  const query = `
    INSERT INTO confessions (id, college, message)
    VALUES (gen_random_uuid(), $1, $2)
    RETURNING *;
  `;

  const result = await db.query(query, [college, message]);
  return result.rows[0];
}

async function getByCollege(college) {
  try {
    let query = `
      SELECT * FROM confessions
    `;

    const values = [];

    if (college) {
      query += ` WHERE college = $1`;
      values.push(college);
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    const result = await db.query(query, values);
    return result.rows;

  } catch (err) {
    console.error("Confession repository getByCollege error:", err.message);
    throw err;
  }
}

module.exports = { create, getByCollege };