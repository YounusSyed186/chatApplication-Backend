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

async function getConfessions(filter) {
  try {
    let query = `SELECT * FROM confessions`;
    let values = [];

    if (filter && filter !== "all") {
      if (filter === "none") {
        query += ` WHERE college IS NULL`;
      } else {
        query += ` WHERE college = $1`;
        values.push(filter);
      }
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    const result = await db.query(query, values);
    return result.rows;

  } catch (err) {
    console.error("Confession repository error:", err.message);
    throw err;
  }
}

async function getLikes(confessionId) {
  const result = await db.query(
    "SELECT likes FROM confessions WHERE id = $1",
    [confessionId]
  );

  if (result.rows.length === 0) {
    throw new Error("Confession not found");
  }

  return result.rows[0];
}

async function likeConfession(confessionId) {
  const result = await db.query(
    `UPDATE confessions 
     SET likes = likes + 1 
     WHERE id = $1 
     RETURNING likes`,
    [confessionId]
  );

  if (result.rows.length === 0) {
    throw new Error("Confession not found");
  }

  return result.rows[0];
}

module.exports = { create, getConfessions, getLikes, likeConfession };