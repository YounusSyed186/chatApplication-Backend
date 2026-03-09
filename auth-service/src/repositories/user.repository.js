const db = require("../config/db");

async function findUserByEmail(email) {
  const result = await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  return result.rows[0];
}

async function findUserById(id) {
  const result = await db.query(
    "SELECT * FROM users WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

async function createUser(email, passwordHash) {
  const result = await db.query(
    "INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING *",
    [email, passwordHash]
  );

  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};