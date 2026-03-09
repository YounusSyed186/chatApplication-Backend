const db = require("../config/db");

async function updateProfile(data) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const embeddingString = `[${data.embedding.join(",")}]`;

    const userQuery = `
UPDATE users
SET college = $1,
    year = $2,
    branch = $3,
    interests = $4,
    bio = $5,
    website = $6,
    linkedin = $7,
    github = $8,
    twitter = $9,
    username = $10
WHERE id = $11
`;

    await client.query(userQuery, [
  data.college,
  data.year,
  data.branch,
  data.interests,
  data.bio,
  data.website,
  data.linkedin,
  data.github,
  data.twitter,
  data.username,
  data.userId
]);

    const embeddingQuery = `
      INSERT INTO user_embeddings(user_id, embedding)
      VALUES($1, $2::vector)
      ON CONFLICT (user_id)
      DO UPDATE SET embedding = EXCLUDED.embedding
    `;

    await client.query(embeddingQuery, [
      data.userId,
      embeddingString
    ]);

    await client.query("COMMIT");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("User repository updateProfile error:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { updateProfile };