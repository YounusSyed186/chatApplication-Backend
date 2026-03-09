const db = require("../config/db");

async function createRoom(name, members) {
  const result = await db.query(
    "INSERT INTO rooms (name, members) VALUES ($1, $2) RETURNING *",
    [name, JSON.stringify(members)]
  );
  return result.rows[0];
}

async function getRoomById(id) {
  const result = await db.query(
    "SELECT * FROM rooms WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function getRoomsForUser(userId) {
  const result = await db.query(
    "SELECT * FROM rooms WHERE $1 = ANY(members)",
    [userId]
  );
  return result.rows;
}

module.exports = {
  createRoom,
  getRoomById,
  getRoomsForUser
};